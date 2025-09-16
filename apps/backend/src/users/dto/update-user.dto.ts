import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '+33 1 23 45 67 89', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Senior Architect', required: false })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiProperty({ example: 'Architecture', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: 'Experienced architect with 10+ years in sustainable design...', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: '["AutoCAD", "Revit", "Sustainable Design"]', required: false })
  @IsString()
  @IsOptional()
  skills?: string;

  @ApiProperty({ example: '10+ years', required: false })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({ example: '["LEED AP", "Architect License"]', required: false })
  @IsString()
  @IsOptional()
  certifications?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/johndoe', required: false })
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @ApiProperty({ example: 'https://johndoe.com', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'Europe/Paris', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: 'fr', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
