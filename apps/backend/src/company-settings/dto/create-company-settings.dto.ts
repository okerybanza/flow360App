import { IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanySettingsDto {
  @ApiProperty({ example: '360Flow Architecture' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '#1e40af' })
  @IsHexColor()
  primaryColor: string;

  @ApiProperty({ example: '#64748b' })
  @IsHexColor()
  secondaryColor: string;

  @ApiProperty({ example: '#0ea5e9' })
  @IsHexColor()
  accentColor: string;

  @ApiProperty({ example: '#10b981', required: false })
  @IsHexColor()
  @IsOptional()
  successColor?: string;

  @ApiProperty({ example: '#f59e0b', required: false })
  @IsHexColor()
  @IsOptional()
  warningColor?: string;

  @ApiProperty({ example: '#ef4444', required: false })
  @IsHexColor()
  @IsOptional()
  dangerColor?: string;

  @ApiProperty({ example: 'Inter', required: false })
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiProperty({ example: 'medium', required: false })
  @IsString()
  @IsOptional()
  fontSize?: string;

  @ApiProperty({ example: 'contact@360flow.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+33 1 23 45 67 89', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Rue de la Paix, 75001 Paris', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'https://360flow.com', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'EUR' })
  @IsString()
  currency: string;
}
