import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClient {
  @IsString()
  username: string;

  @IsString()
  description: string;
}

export class UpdateClient extends CreateClient {
  @IsNumber()
  clientId: string;
}
