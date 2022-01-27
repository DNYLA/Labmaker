import { Education, Subjects, TicketType } from '@prisma/client';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  creatorId: string;

  @IsString()
  serverId: string;

  //Add Validation to the Enums Below
  @IsString()
  type: TicketType;

  @IsString()
  subject: Subjects;

  @IsString()
  education: Education;

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
