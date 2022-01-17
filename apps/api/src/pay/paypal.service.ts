import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { PayGatewayOperation } from './dtos/PayGatewayMessage.dto';
import { PayGateway } from './pay.gateway';

@Injectable()
export class PayPalService {
  private client = new paypal.core.PayPalHttpClient(this.environment());
  private logger = new Logger(PayPalService.name);

  constructor(
    private readonly payGateway: PayGateway,
    private httpService: HttpService,
    private prismaService: PrismaService
  ) {}

  private get credentials() {
    const creds: { clientID: string; clientSecret: string } = {
      clientID: process.env.PAYPAL_CID,
      clientSecret: process.env.PAYPAL_CSECRET,
    };

    // If client id or secret are not present, return an error
    if (!creds || !creds.clientID || !creds.clientSecret) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'PayPal app credentials are not defined.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Return creds if no error was thrown above
    return creds;
  }

  private get webhookID(): string {
    const whid = process.env.PAYPAL_WHID;

    if (!whid) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'PayPal WHID is not defined.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return whid;
  }

  private environment() {
    const { clientID, clientSecret } = this.credentials;

    if (process.env.ENVIRONMENT === 'PRODUCTION') {
      return new paypal.core.LiveEnvironment(clientID, clientSecret);
    }

    // If didnt return above, use Sandbox environment
    return new paypal.core.SandboxEnvironment(clientID, clientSecret);
  }

  /**
   * Create an order in the PayPal API and return the checkout link.
   * @param {string} tutorId - string,
   * @param {string} channelId - string,
   * @param {number} price - number
   * @returns The url to the checkout page.
   */
  public async createOrder(
    tutorId: string,
    channelId: string,
    price: number
  ): Promise<{ url: string }> {
    if (isNaN(price)) {
      Logger.log('Throwing Error for invalid price');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Price for the order must be a number!',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Make sure ticket exists in db
    const ticket = await this.prismaService.ticket.findFirst({
      where: { channelId: channelId },
    });

    if (!ticket) {
      Logger.log('Throwing Error for ticket');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Ticket does not exist!',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: price,
          },
        },
      ],
      // https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
      application_context: {
        brand_name: process.env.PAYPAL_BRAND_NAME || 'LabMaker',
        landing_page: 'NO_PREFERENCE',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.API_URL}/pay/order/paid`,
        cancel_url: `${process.env.API_URL}/pay/order/cancelled`,
      },
    });

    const response = await this.client.execute(request);
    const order = response.result;

    // Add order id to ticket.
    await this.prismaService.order.create({
      data: {
        status: 'CREATED',
        tutorId: tutorId,
        transactionId: order.id,
        ticketId: ticket.id,
      },
    });

    // Return checkout link if it exists
    const checkoutLink = order.links.find((e) => e.rel == 'approve').href;
    if (checkoutLink) {
      return { url: checkoutLink };
    } else {
      this.logger.warn(
        `Couldn't find checkout link amongst these links: ${JSON.stringify(
          order.links
        )}`
      );

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Was unable to retrieve checkout link from PayPal.`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * `captureOrder` calls the `OrdersCaptureRequest` API endpoint to capture an order.
   * @param {string} orderId - The ID of the order to capture.
   * @returns None
   */
  private async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    // Call API with your client and get a response for your call
    const response = await this.client.execute(request);

    this.logger.log(`Capturing Order: ${response.result.id}`);
  }

  /**
   * Verify the webhook data, and if it's valid, then capture the funds.
   * 
   * # **Step 4:** Create a webhook for the Payee.
   * # 
   * # **Note:** This is the webhook that will be used to notify the Payee that the funds have been
  captured.
   * @param {any} data - The data object that was sent by the webhook.
   * @param {object} headers - object
   * @returns None
   */
  public async handleWH(data: any, headers: object) {
    // Verify WH before accepting it as valid and using data in it.
    const isValid = await this.verifyWH(headers, data);

    if (isValid) {
      // Order approved by customer, now capture payment
      if (data.event_type == 'CHECKOUT.ORDER.APPROVED') {
        const oinfo = data.resource;

        this.captureOrder(oinfo.id);

        this.logger.log(`Checkout completed, attempting to capture funds..`);
      }

      // Checkout completed, but funds are still processing!
      if (data.event_type == 'CHECKOUT.ORDER.COMPLETED') {
        const oinfo = data.resource;
        const amount = oinfo.gross_amount;

        this.logger.log(
          `Payment of ${amount.value} ${amount.currency_code} is **processing**.`
        );
      }

      // Funds have been captured from the payee, payment process fully completed
      if (data.event_type == 'PAYMENT.CAPTURE.COMPLETED') {
        const oinfo = data.resource;
        const breakdown = oinfo.seller_receivable_breakdown;

        const netStr = `${breakdown.net_amount.value}${breakdown.net_amount.currency_code}`;
        const feeStr = `${breakdown.paypal_fee.value}${breakdown.paypal_fee.currency_code}`;

        this.logger.log(
          `Captured A Payment. Net: ${netStr}, Paypal Fee: ${feeStr}`
        );

        // Get order from db again with tx id, for Ticket channelId
        const order = await this.prismaService.order.update({
          where: {
            transactionId: oinfo.supplementary_data.related_ids.order_id,
          },
          data: {
            status: 'PAID',
          },
          include: { ticket: true },
        });

        if (order) {
          this.payGateway.notifyAll({
            op: PayGatewayOperation.PaymentCompleted,
            data: {
              channelId: order.ticket.channelId,
              paid: true,
              breakdown: {
                fee: {
                  value: breakdown.paypal_fee.value,
                  currencyCode: breakdown.paypal_fee.currency_code,
                },
                gross: {
                  value: breakdown.gross_amount.value,
                  currencyCode: breakdown.gross_amount.currency_code,
                },
                net: {
                  value: breakdown.net_amount.value,
                  currencyCode: breakdown.net_amount.currency_code,
                },
              },
            },
          });
        } else {
          this.logger.error(
            `Payment Capture Completed, but couldn't find relating ticket! ${JSON.stringify(
              oinfo
            )}`
          );
        }
      }
    }
  }

  /**
   * Verify the webhooks integrity - that is was actually sent by paypal.
   * @param headers Webhooks request headers.
   * @param data Webhook data
   * @returns True/False depending on if it is valid or not.
   */
  public async verifyWH(headers: object, data: any) {
    const verifyEndPoint =
      process.env.ENVIRONMENT === 'PRODUCTION'
        ? 'https://api-m.paypal.com/v1/notifications/verify-webhook-signature'
        : 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature';

    // base64 encode our credentials to form our token to send to paypal
    const cred = this.credentials;
    const authTkn = Buffer.from(
      `${cred.clientID}:${cred.clientSecret}`
    ).toString('base64');

    try {
      // Send webhook details to paypal so they can verify it for us
      const resp = await firstValueFrom(
        this.httpService.post(
          `${verifyEndPoint}`,
          {
            auth_algo: headers['paypal-auth-algo'],
            cert_url: headers['paypal-cert-url'],
            transmission_id: headers['paypal-transmission-id'],
            transmission_sig: headers['paypal-transmission-sig'],
            transmission_time: headers['paypal-transmission-time'],
            webhook_id: this.webhookID,
            webhook_event: data,
          },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${authTkn}`,
              'User-Agent': 'LabMaker-PIPN-Verifier/0.1',
            },
          }
        )
      );

      if (resp.data.verification_status == 'SUCCESS') {
        return true;
      }
    } catch (err) {
      const resp = err.response;
      const data = resp.data;

      let msg = `Error verifying webhook: ${resp.status} ${resp.statusText} => `;

      if (data.error && data.error_description)
        msg += `${data.error}: ${data.error_description}`;
      // Just pass through whole json body if error doesn't conform to fields in if above, so atleast we have everything we need to handle an error
      else msg += JSON.stringify(data);

      this.logger.error(msg);
      return false;
    }

    // If true isn't returned above, then we must have failed somewhere
    this.logger.warn('Invalid webhook recieved');
    return false;
  }
}
