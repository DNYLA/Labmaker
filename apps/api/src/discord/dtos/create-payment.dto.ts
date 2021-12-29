import { Type } from 'class-transformer';
import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  serverId: string;

  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsString()
  type: string;
}

export class UpdatePaymentDto extends CreatePaymentDto {
  @IsOptional()
  @IsNumber()
  id: number;
}

export class CreatePaymentDtoArray {
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDto)
  payments: CreatePaymentDto[];
}

export class UpdatePaymentDtoArray {
  @ValidateNested({ each: true })
  @Type(() => UpdatePaymentDto)
  payments: UpdatePaymentDto[];
}
