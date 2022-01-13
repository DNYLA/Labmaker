import { Injectable } from '@nestjs/common';
import { CreateLogDto } from '../dtos/create-log.dto';
import { LogQueryParms } from '../controllers/logs.controller';
import { Log } from '.prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class LogsService {
  @WebSocketServer()
  ws: Server;

  constructor(private prismaService: PrismaService) {}

  async getLogs(nodeId: number): Promise<Log[]> {
    const logs = await this.prismaService.log.findMany({
      take: 250,
      orderBy: { id: 'desc' },
      where: { nodeId },
    });

    return logs;
  }

  async queryGetLogs(nodeId: number, query: LogQueryParms): Promise<Log[]> {
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
    const logs = await this.getLogs(nodeId);
    const submissionIds = [];

    logs.forEach((log) => {
      submissionIds.push(log.subId);
    });

    return submissionIds;
  }

  async createLog(newLog: CreateLogDto): Promise<Log> {
    const log = await this.prismaService.log.create({ data: newLog });
    this.ws.to(log.nodeId.toString()).emit('log', JSON.stringify(log)); //Dont Notify BOT since thats the application type we received the log from.

    return log;
  }
}
