import { Injectable } from '@nestjs/common';
import { CreateLogDto } from '../dtos/create-log.dto';
import { LogQueryParms } from '../controllers/logs.controller';
import { Log } from '.prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WebsocketGateway } from '../../websockets/socket';
import { UserDetails } from '../../utils/types';
import { UserService } from '../../user/user.service';
import { UserLogsService } from '../../logs/logs.service';

@Injectable()
export class LogsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private userLogs: UserLogsService,
    private wsGateway: WebsocketGateway
  ) {}

  async getLogs(
    nodeId: number,
    didPm: boolean,
    user: UserDetails
  ): Promise<Log[]> {
    this.userService.validNode(user, nodeId);

    let filter: { nodeId: number; pm?: true };
    if (didPm) filter = { nodeId, pm: didPm };
    else filter = { nodeId };

    const logs = await this.prismaService.log.findMany({
      take: 250,
      orderBy: { id: 'desc' },
      where: filter,
    });

    const len = logs.length;
    let componentId = null;

    if (logs.length > 0) {
      componentId = `${logs[len - 1].id} - ${logs[0].id}`; //List is sorted DESC so firstID = 250 last = 0
    }

    this.userLogs.createLog(user, {
      componentName: 'REDDIT',
      componentType: LogsService.name,
      componentId,
      numRows: len,
    });

    return logs;
  }

  async queryGetLogs(
    nodeId: number,
    query: LogQueryParms,
    user: UserDetails
  ): Promise<Log[]> {
    this.userService.validNode(user, nodeId);

    const filter = { nodeId, pm: false };

    if (query.pmOnly) {
      filter.pm = true;
    }

    return await this.prismaService.log.findMany({
      take: 250,
      orderBy: { id: 'desc' },
      where: filter,
    });
  }

  async getSubmissionIds(nodeId: number): Promise<string[]> {
    const logs = await this.prismaService.log.findMany({
      take: 250,
      orderBy: { id: 'desc' },
      where: { nodeId },
      select: { subId: true },
    });

    //Change Reddit-Bot into allowing this type
    // return logs;

    const submissionIds = [];
    logs.forEach((log) => {
      submissionIds.push(log.subId);
    });

    return submissionIds;
  }

  async createLog(newLog: CreateLogDto): Promise<Log> {
    const log = await this.prismaService.log.create({ data: newLog });

    for (let i = 0; i < 100; i++) {
      await this.prismaService.log.create({ data: newLog });
    }
    if (newLog.pm) this.wsGateway.notifyLog(log); //Dont Notify BOT since thats the application type we received the log from.

    return log;
  }

  async createManyLogs(newLog: CreateLogDto) {
    for (let i = 0; i < 100; i++) {
      await this.prismaService.log.create({ data: newLog });
    }
  }
}
