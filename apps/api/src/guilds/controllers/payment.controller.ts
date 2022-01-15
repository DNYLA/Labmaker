import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Payment } from '@prisma/client';
import {
  CreatePaymentDtoArray,
  UpdatePaymentDtoArray,
} from '../dtos/create-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('guilds')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:id/payments')
  getPayments(@Param('id') serverId: string): Promise<Payment[]> {
    return this.paymentService.getPayments(serverId);
  }

  @Post('/:id/payments')
  async createPayments(
    @Body() body: CreatePaymentDtoArray
  ): Promise<Payment[] | undefined> {
    return await this.paymentService.createPayments(body);
  }

  @Put('/:id/payments')
  updatePayments(@Body() body: UpdatePaymentDtoArray): Promise<Payment[]> {
    return this.paymentService.updatPayments(body);
  }

  @Delete('/:id/payments')
  deletePayments(@Body() body: number[]): Promise<void> {
    return this.paymentService.deletePayments(body);
  }
}
