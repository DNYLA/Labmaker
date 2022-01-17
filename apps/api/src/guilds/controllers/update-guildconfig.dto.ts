import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  id: string;

  @IsString()
  paymentConfigId: string;

  @IsOptional()
  @IsString()
  prefix: string;

  @IsOptional()
  @IsString()
  embedImageUrl: string;

  @IsOptional()
  @IsBoolean()
  autoSwitcher: boolean;

  @IsOptional()
  @IsBoolean()
  autoTicket: boolean;

  @IsOptional()
  @IsBoolean()
  autoReact: boolean;
}

