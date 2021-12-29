import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
  @IsNumber()
  nodeId: number;

  @IsString()
  message: string;

  @IsString()
  subId: string;

  @IsString()
  username: string;

  @IsString()
  subreddit: string;

  @IsBoolean()
  pm: boolean;
}
