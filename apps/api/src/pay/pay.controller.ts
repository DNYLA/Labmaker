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

  // For now return simple success/failure, in the future this will be elsewhere and not on the api.
  @Get('order/:status')
  public async paypalCheckoutReturn(
    @Param('status') status: 'paid' | 'cancelled'
  ) {
    let title = 'Order Successful!';
    let body = 'Your order has completed successfully!';

    if (status == 'cancelled') {
      title = 'Order Cancelled!';
      body = 'You cancelled the order!';
    }

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body>
      ${body}
    </body>
    </html>`;
  }

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
}
