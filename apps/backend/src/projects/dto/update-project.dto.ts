import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['clientId'] as const),
) {}
