import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectTemplateDto {
  @ApiProperty({ example: 'Projet résidentiel' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Template pour projets résidentiels', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
