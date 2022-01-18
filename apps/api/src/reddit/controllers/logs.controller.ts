import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Log } from '@prisma/client';
import { CreateLogDto } from '../dtos/create-log.dto';
import { LogsService } from '../services/logs.service';

export type LogQueryParms = {
  pmOnly: boolean;
};

@Controller('reddit/logs')
export class LogsController {
  constructor(private readonly logService: LogsService) {}

  @Get('/:id')
  getLog(
    @Param('id') nodeId: number,
    @Query('pm') didPm: boolean
  ): Promise<Log[]> {
    return this.logService.getLogs(nodeId, didPm);
  }

  //Test & Finish Later
  // @Get('/:id')
  // async getQueryParms(
  //   @Param('id') nodeId: string,
  //   @Query() q: LogQueryParms,
  //   @Query('pmOnly') l: boolean,
  // ) {
  //   console.log(l);
  //   console.log(q.pmOnly);
  //   return this.logService.queryGetLogs(nodeId, q);
  // }

  @Get('submissions/:id')
  getSubmissions(@Param('id') nodeId: number): Promise<string[]> {
    return this.logService.getSubmissionIds(nodeId);
  }

  @Post()
  createLog(@Body() body: CreateLogDto): Promise<Log> {
    return this.logService.createLog(body);
  }
}
