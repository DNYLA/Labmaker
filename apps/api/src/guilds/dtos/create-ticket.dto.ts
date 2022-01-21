import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  creatorId: string;

  @IsString()
  serverId: string;

  @IsString()
  type: string;

  @IsString()
  subject: string;

  @IsString()
  education: string;

  @IsNumber()
  budget: number;

  @IsString()
  additionalInfo: string;

  @IsDate()
  date: Date;
}

export class UpdateTicketDto extends CreateTicketDto {
  @IsNumber()
  id: number;
}
