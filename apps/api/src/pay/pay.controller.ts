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

  @Get('create_order/:ticketId/:price')
  @UseGuards(JwtAuthGuard)
  public async paypalCreateOrder(
    @Param('ticketId') ticketId: string,
    @Param('price') price: number,
  ): Promise<{ url: string }> {
    return await this.payPalService.createOrder(ticketId, price);
  }

  @Post('ppwhnotif') // Rando route to avoid randos spamming it
  @HttpCode(200) // Paypal IPN requires a 200 to be sent back, otherwise it keeps re-sending the notification
  public paypalWH(@Req() req: Request): void {
    this.payPalService.handleWH(req.body, req.headers);
  }
}
