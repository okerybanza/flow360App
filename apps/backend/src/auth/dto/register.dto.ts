import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  role: UserRole;
}
