import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateTaskDto {
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
}

export class CreateTemplateStepDto {
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

  @ApiProperty({ type: [CreateTemplateTaskDto], required: false })
  @IsArray()
  @IsOptional()
  tasks?: CreateTemplateTaskDto[];
}
