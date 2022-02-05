import { Module } from '@nestjs/common';
import { UserLogsService } from './logs.service';

@Module({ providers: [UserLogsService], exports: [UserLogsService] })
export class LogsModule {}
