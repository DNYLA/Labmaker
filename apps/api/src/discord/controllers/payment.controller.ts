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

@Controller('discord/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:id')
  getPayments(@Param('id') serverId: string): Promise<Payment[]> {
    return this.paymentService.getPayments(serverId);
  }

  @Post()
  async createPayments(
    @Body() body: CreatePaymentDtoArray,
  ): Promise<Payment[] | any> {
    return await this.paymentService.createPayments(body);
  }

  @Put()
  updatePayments(@Body() body: UpdatePaymentDtoArray): Promise<Payment[]> {
    return this.paymentService.updatPayments(body);
  }

  @Delete()
  deletePayments(@Body() body: any): Promise<void> {
    return this.paymentService.deletePayments(body);
  }
}
