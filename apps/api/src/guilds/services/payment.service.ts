import { Injectable, Logger } from '@nestjs/common';
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

  /**
   * Get all payments for a server.
   * @param {string} serverId - string - The server ID to get payments for.
   * @returns The array of payments.
   */
  async getPayments(serverId: string): Promise<Payment[]> {
    return await this.prismaService.payment.findMany({
      where: { serverId },
      orderBy: {
        type: 'asc',
      },
    });
  }

  /**
   * Create multiple payments.
   * @param {CreatePaymentDtoArray} paymentArray - CreatePaymentDtoArray
   * @returns The created payment objects.
   */
  async createPayments(
    paymentArray: CreatePaymentDtoArray
  ): Promise<Payment[] | undefined> {
    return await this.prismaService.$transaction(
      paymentArray.payments.map((payment) =>
        this.prismaService.payment.create({ data: payment })
      )
    );
  }

  /**
   * Update payments.
   * @param {UpdatePaymentDtoArray} updatedPayments - UpdatePaymentDtoArray
   * @returns The updated payments.
   */
  async updatPayments(
    updatedPayments: UpdatePaymentDtoArray
  ): Promise<Payment[] | undefined> {
    const savedPayments = [];
    const { payments } = updatedPayments;

    await Promise.all(
      payments.map(async (payment) => {
        const updatedPayment = await this.prismaService.payment.update({
          where: { id: payment.id },
          data: payment,
        });
        savedPayments.push(updatedPayment);
      })
    );

    return savedPayments;
  }

  /**
   * `deletePayments` accepts an array of `deleteIds` and deletes all of them from the database.
   * @param deleteIds - number[]
   * @returns None
   */
  async deletePayments(deleteIds: number[]): Promise<void> {
    deleteIds.forEach(
      async (id) => await this.prismaService.payment.delete({ where: { id } })
    );
  }
}
