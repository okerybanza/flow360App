import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StepStatus } from '@prisma/client';

export class CreateProjectStepDto {
  @ApiProperty({ example: 'Phase de conception' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Études préliminaires et plans', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'PENDING', enum: StepStatus, required: false })
  @IsEnum(StepStatus)
  @IsOptional()
  status?: StepStatus;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2025-02-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;

  @ApiProperty({ example: 'project-id' })
  @IsString()
  projectId: string;
}
