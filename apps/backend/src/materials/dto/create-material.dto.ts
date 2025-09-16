import { IsString, IsNumber, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Currency {
  USD = 'USD',
  CDF = 'CDF',
}

export class CreateMaterialDto {
  @ApiProperty({ example: 'Ciment Portland' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Lafarge', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'kg' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 15.50 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: Currency.USD, enum: Currency, default: Currency.USD })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ example: 'Matériaux de construction', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}
