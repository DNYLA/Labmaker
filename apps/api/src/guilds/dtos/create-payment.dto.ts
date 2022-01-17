import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
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

  @IsOptional()
  @IsBoolean()
  newPayment: boolean;

  @IsOptional()
  @IsBoolean()
  deletedPayment: boolean;
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
