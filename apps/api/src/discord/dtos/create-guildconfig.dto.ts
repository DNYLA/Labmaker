import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateConfigDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon: string;

  @IsOptional()
  @IsString()
  prefix: string;

  @IsOptional()
  @IsString()
  embedImageUrl: string;

  @IsOptional()
  @IsString()
  paymentConfigId: string;

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
