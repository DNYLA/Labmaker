import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/Jwt.guard';
import { PayPalService } from './paypal.service';

@Controller('pay')
export class PayController {
  constructor(private payPalService: PayPalService) {}

  @Get('create_order/:tutorId/:channelId/:price')
  @UseGuards(JwtAuthGuard)
  public async paypalCreateOrder(
    @Param('tutorId') tutorId: string,
    @Param('channelId') channelId: string,
    @Param('price') price: number
  ): Promise<{ url: string }> {
    return await this.payPalService.createOrder(tutorId, channelId, price);
  }

  @Post('ppwhnotif') // Sorta rando route to avoid randos spamming it
  @HttpCode(200) // Paypal IPN requires a 200 to be sent back, otherwise it keeps re-sending the notification
  public paypalWH(@Req() req: Request): void {
    this.payPalService.handleWH(req.body, req.headers);
  }

  // For now return simple success/failure, in the future this will be elsewhere and not on the api.
  @Get('order/:status')
  public async paypalCheckoutReturn(
    @Param('status') status: 'paid' | 'cancelled'
  ) {
    let title = 'Order Successful!';
    let body = 'Your order has completed successfully!';
    let bodySub =
      'One it is finished processing, our bot will send a message in your ticket.';
    let svg = `<path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />`;
    let svgFill = 'darkgreen';

    if (status == 'cancelled') {
      title = 'Order Cancelled!';
      body = 'You cancelled the order!';
      bodySub =
        "The order was cancelled. Let us know what's going on in the ticket!";
      svg = `<path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        />`;
      svgFill = 'darkred';
    }

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
    
          body {
            font-family: sans-serif;
            font-size: large;
          }
    
          .container {
            display: flex;
            justify-content: center;
            width: 100vw;
            height: 100vh;
          }
    
          .content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            max-width: 700px;
            text-align: center;
            margin: 30px;
          }
    
          .content svg {
            margin-bottom: 15px;
          }
    
          .content h2 {
            margin-bottom: 10px;
          }
    
          .content p {
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="52"
              height="52"
              fill="${svgFill}"
            >
              ${svg}
            </svg>

            <h2><b>${body}</b></h2>
            <p class="subtitle">${bodySub}</p>
            <p><i>You can safely close this tab.</i></p>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}
