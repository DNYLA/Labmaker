import { Injectable, Logger } from '@nestjs/common';
import {
  CreatePaymentDto,
  CreatePaymentDtoArray,
  UpdatePaymentDto,
  UpdatePaymentDtoArray,
} from '../dtos/create-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(PaymentService.name);

  async getPayments(serverId: string): Promise<Payment[]> {
    return await this.prismaService.payment.findMany({
      where: { serverId },
      orderBy: {
        type: 'asc',
      },
    });

    // const groupedPayments = await this.prismaService.payment.groupBy({
    //   by: ['type'],
    //   where: { serverId },
    // });

    // return groupedPayments;
  }

  async createPayments(
    paymentArray: CreatePaymentDtoArray,
  ): Promise<Payment[] | any> {
    //CreateMany doesnt return created objects which we need.

    /* return await this.prismaService.payment.createMany({
      data: paymentArray.payments,
    });
    */

    return await this.prismaService.$transaction(
      paymentArray.payments.map((payment) =>
        this.prismaService.payment.create({ data: payment }),
      ),
    );
  }

  async updatPayments(
    updatedPayments: UpdatePaymentDtoArray,
  ): Promise<Payment[] | any> {
    const savedPayments = [];
    const { payments } = updatedPayments;

    await Promise.all(
      payments.map(async (payment) => {
        const updatedPayment = await this.prismaService.payment.update({
          where: { id: payment.id },
          data: payment,
        });
        savedPayments.push(updatedPayment);
      }),
    );

    return savedPayments;
  }

  async deletePayments(deleteIds: number[]): Promise<void> {
    deleteIds.forEach(
      async (id) => await this.prismaService.payment.delete({ where: { id } }),
    );
  }
}
