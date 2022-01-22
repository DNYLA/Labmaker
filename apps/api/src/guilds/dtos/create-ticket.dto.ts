import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsOptional()
  additionalInfo: string;

  @IsDateString({ message: 'Invalid Date' })
  due: string;
}

export class UpdateTicketDto extends CreateTicketDto {
  @IsNumber()
  id: number;
}
