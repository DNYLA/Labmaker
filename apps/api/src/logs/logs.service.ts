import { Injectable } from '@nestjs/common';
import { Log, Role, Ticket, UserLogType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDetails } from '../utils/types';
import { LogInfo } from '../utils/types';

@Injectable()
export class UserLogsService {
  constructor(private prismaService: PrismaService) {}

  // async createLog(
  //   userInfo: string,
  //   action: UserLogType,
  //   info: LogInfo
  // ): Promise<void> {
  //   const { componentName, componentType, action, information, numRows } = info;
  //   console.log('Createing');
  //   // componentName String      @map("component_name")
  //   // componentType String      @map("component_type")
  //   // ipAddress     String      @map("ip_address")
  //   // userAgent     String      @map("user_agent")
  //   // action        UserLogType
  //   // information   String?
  //   // timestamp     DateTime    @default(now())
  //   // rowNum        Int         @default(1) @map("num_rows")
  //   await this.prismaService.userLogs.create({
  //     data: {
  //       userId,
  //       componentName,
  //       componentType,
  //       action,
  //       information,
  //       numRows,
  //     },
  //   });
  // }
}
