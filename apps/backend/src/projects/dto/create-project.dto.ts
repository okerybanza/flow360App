import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'Rénovation Appartement Paris' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Rénovation complète d\'un appartement de 80m²', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.DRAFT, required: false })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ example: 50000, required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-06-15', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'client-id-here' })
  @IsString()
  clientId: string;

  @ApiProperty({ example: ['user-id-1', 'user-id-2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];
}
