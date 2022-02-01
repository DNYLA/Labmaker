import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Log } from '@prisma/client';
import { UserDetails } from '../../auth/userDetails.dto';
import { CurrentUser } from '../../utils/decorators';
import { JwtAuthGuard, JwtBotAuthGuard } from '../../auth/guards/Jwt.guard';
import { CreateLogDto } from '../dtos/create-log.dto';
import { LogsService } from '../services/logs.service';

export type LogQueryParms = {
  pmOnly: boolean;
};

@Controller('reddit/logs')
export class LogsController {
  constructor(private readonly logService: LogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getLog(
    @Param('id') nodeId: number,
    @Query('pm') didPm: boolean,
    @CurrentUser() user: UserDetails
  ): Promise<Log[]> {
    return this.logService.getLogs(nodeId, didPm, user);
  }

  //Test & Finish Later
  // @UseGuards(JwtAuthGuard)
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

  //Make this Depracted
  @UseGuards(JwtBotAuthGuard)
  @Get('submissions/:id')
  getSubmissions(@Param('id') nodeId: number): Promise<string[]> {
    return this.logService.getSubmissionIds(nodeId);
  }

  @UseGuards(JwtBotAuthGuard)
  @Post()
  createLog(@Body() body: CreateLogDto): Promise<Log> {
    return this.logService.createLog(body);
  }
}
