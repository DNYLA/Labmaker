import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon: string;
}

export class UpdateConfigDto extends CreateConfigDto {
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

  @IsString()
  paymentConfigId: string;

  @IsOptional()
  @IsString()
  ordersCategory: string;

  @IsOptional()
  @IsString()
  notificationChannel: string;

  @IsOptional()
  @IsString()
  tutorRole: string;

  @IsOptional()
  @IsString()
  staffRole: string;

  @IsString()
  channelName: string;

  @IsOptional()
  @IsString()
  newMessage: string;

  @IsOptional()
  @IsString()
  acceptedMessage: string;

  @IsOptional()
  @IsString()
  deleteMessage: string;

  @IsBoolean()
  hideChannel: boolean;

  @IsBoolean()
  notifyUser: boolean;
}
