import { IsEmail, IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientStatus, ClientType } from '@prisma/client';

export class CreateClientDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+33123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St, Paris', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: ClientStatus, example: ClientStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiProperty({ enum: ClientType, example: ClientType.INDIVIDUAL, required: false })
  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType;

  @ApiProperty({ example: 'Acme Corporation', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'https://www.acme.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;
}
