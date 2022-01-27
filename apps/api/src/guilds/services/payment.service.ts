import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreatePaymentDtoArray,
  UpdatePaymentDtoArray,
} from '../dtos/create-payment.dto';
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
  }

  async createPayments(
    paymentArray: CreatePaymentDtoArray
  ): Promise<Payment[] | undefined> {
    return await this.prismaService.$transaction(
      paymentArray.payments.map((payment) => {
        return this.prismaService.payment.create({
          data: { ...payment },
        });
      })
    );
  }

  async updatPayments(
    updatedPayments: UpdatePaymentDtoArray
  ): Promise<Payment[] | undefined> {
    console.log(updatedPayments);
    return await this.prismaService.$transaction(
      updatedPayments.payments.map((payment) => {
        if (payment.newPayment) {
          const { name, value, type, serverId } = payment;
          return this.prismaService.payment.create({
            data: { name, value, type, serverId },
          });
        } else if (payment.deletedPayment) {
          return this.prismaService.payment.delete({
            where: { id: payment.id },
          });
        }
        return this.prismaService.payment.update({
          where: { id: payment.id },
          data: payment,
        });
      })
    );
  }

  async deletePayments(deleteIds: number[]): Promise<HttpStatus> {
    await this.prismaService.$transaction(
      deleteIds.map((id) => {
        return this.prismaService.payment.delete({
          where: { id },
        });
      })
    );

    return HttpStatus.OK;
  }
}
