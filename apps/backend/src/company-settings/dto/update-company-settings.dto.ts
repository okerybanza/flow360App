import { PartialType } from '@nestjs/swagger';
import { CreateCompanySettingsDto } from './create-company-settings.dto';

export class UpdateCompanySettingsDto extends PartialType(CreateCompanySettingsDto) {}
