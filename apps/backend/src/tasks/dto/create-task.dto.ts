import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Créer les plans conceptuels' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Développer les plans initiaux', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'TODO', enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: 'MEDIUM', enum: Priority, required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ example: '2025-01-15T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: '2025-01-15T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  plannedStartDate?: string;

  @ApiProperty({ example: '2025-01-20T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  plannedEndDate?: string;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({ example: 4, required: false })
  @IsNumber()
  @IsOptional()
  actualDuration?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isCustom?: boolean;

  @ApiProperty({ example: 'user-id', required: false })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ example: 'step-id' })
  @IsString()
  stepId: string;

  @ApiProperty({ example: 'user-id' })
  @IsString()
  createdBy: string;
}
