import { Subjects } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDTO {
  @IsString()
  applicationMessage: string;

  @IsString()
  vouchesLink: string;

  @IsOptional()
  @IsString()
  redditUsername: string;

  // @IsEnum(Subjects, { each: true }) //Cant Verify this becasue of how
  //Prisma works with Enums currently
  //Need to find a Work Around
  subjects: Subjects[];
}
