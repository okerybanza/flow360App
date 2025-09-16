import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateFileCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsOptional()
  parentId?: string
}
