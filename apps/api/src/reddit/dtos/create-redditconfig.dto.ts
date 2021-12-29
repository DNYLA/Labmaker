import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  userId: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  userAgent: string;

  @IsString()
  title: string;

  @IsString()
  pmBody: string;

  @IsString({ each: true })
  @IsNotEmpty()
  subreddits: string[];

  @IsOptional()
  @IsString({ each: true })
  forbiddenWords: string[];

  @IsOptional()
  @IsString({ each: true })
  blockedUsers: string[];

  @IsOptional()
  @IsString({ each: true })
  nodeEditors: string[];
}

export class UpdateConfigDto extends CreateConfigDto {
  @IsNumber()
  id: number;
}
