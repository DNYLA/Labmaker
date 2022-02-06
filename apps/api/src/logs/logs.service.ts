import { Injectable } from '@nestjs/common';
import { Log, Role, Ticket } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDetails } from '../utils/types';
import { LogInfo } from '../utils/types';

@Injectable()
export class UserLogsService {
  constructor(private prismaService: PrismaService) {}

  async createLog(user: UserDetails, info: LogInfo): Promise<void> {
    const {
      componentName,
      componentType,
      componentId,
      information,
      numRows,
      response,
    } = info;
    const { id: userId, ipAddress, userAgent, referer, path, method } = user;

    const data = {
      componentName,
      componentType,
      componentId,
      ipAddress,
      userAgent,
      referer,
      path,
      method,
      information,
      numRows: numRows,
      response,
    };

    if (user.role === Role.BOT) {
      const text = `Requested by BOT ${user.id}`;
      const info_text = information ? `${information} ${text}` : text;
      await this.prismaService.userLogs.create({
        data: {
          ...data,
          information: info_text,
        },
      });
    } else
      await this.prismaService.userLogs.create({ data: { ...data, userId } });
  }
}
