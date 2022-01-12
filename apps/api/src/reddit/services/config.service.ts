import { RedditConfig } from '.prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConfigDto,
  UpdateConfigDto,
} from '../dtos/create-redditconfig.dto';

@Injectable()
export class ConfigService {
  @WebSocketServer()
  ws: Server;

  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(ConfigService.name);

  async getConfig(id: number): Promise<RedditConfig> {
    return await this.prismaService.redditConfig.findUnique({
      where: {
        id,
      },
    });
  }

  async getConfigs(): Promise<RedditConfig[]> {
    return await this.prismaService.redditConfig.findMany();
  }

  async createConfig(newConfig: CreateConfigDto): Promise<RedditConfig> {
    this.logger.log(JSON.stringify(newConfig));
    try {
      const config = await this.prismaService.redditConfig.create({
        data: newConfig,
      });
      this.newConfig(config);

      return config;
    } catch (err) {
      this.logger.error(err);
      return;
    }
  }

  async updateConfig(ucd: UpdateConfigDto): Promise<RedditConfig | undefined> {
    const filter = { id: ucd.id };
    ucd.nodeEditors = ucd.nodeEditors.filter((userId) => userId !== ucd.userId);

    ucd.nodeEditors = [...new Set(ucd.nodeEditors)];
    const config = await this.prismaService.redditConfig.update({
      where: filter,
      data: ucd,
    });

    if (config) {
      this.notifyConfig(config);
      return config;
    }
  }

  async updateMessage(
    id: number,
    message: string
  ): Promise<RedditConfig | undefined> {
    const config = await this.prismaService.redditConfig.update({
      where: { id },
      data: { pmBody: message },
    });

    if (config) {
      this.notifyConfig(config);
      return config;
    }
  }

  async deleteConfig(id: number): Promise<RedditConfig> {
    const config = await this.prismaService.redditConfig.delete({
      where: { id },
    });
    this.ws.to('bot').to(config.id.toString()).emit('deleteConfig', id);

    return config;
  }

  //Websocket Functions Below
  private notifyConfig(config: RedditConfig) {
    this.ws
      .to('bot')
      .to(config.id.toString())
      .emit('config', JSON.stringify(config));
  }

  private newConfig(config: RedditConfig) {
    this.ws.sockets.sockets.forEach((socket) => {
      if (config.userId === socket.data.id) {
        socket.join(config.id.toString());
      } else {
        config.nodeEditors.forEach((id) => {
          if (socket.data.id === id) {
            socket.join(config.id.toString());
          }
        });
      }
    });

    this.notifyConfig(config);
  }
}
