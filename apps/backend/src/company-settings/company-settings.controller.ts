import { Controller, Get, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompanySettingsService } from './company-settings.service';
import { CreateCompanySettingsDto } from './dto/create-company-settings.dto';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Company Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('company-settings')
export class CompanySettingsController {
  constructor(private readonly companySettingsService: CompanySettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create company settings' })
  @ApiResponse({ status: 201, description: 'Company settings created successfully' })
  create(@Body() createCompanySettingsDto: CreateCompanySettingsDto) {
    return this.companySettingsService.create(createCompanySettingsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get company settings' })
  @ApiResponse({ status: 200, description: 'Company settings retrieved successfully' })
  findOne() {
    return this.companySettingsService.findOne();
  }

  @Patch()
  @ApiOperation({ summary: 'Update company settings' })
  @ApiResponse({ status: 200, description: 'Company settings updated successfully' })
  update(@Body() updateCompanySettingsDto: UpdateCompanySettingsDto) {
    return this.companySettingsService.update(updateCompanySettingsDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete company settings' })
  @ApiResponse({ status: 200, description: 'Company settings deleted successfully' })
  remove() {
    return this.companySettingsService.remove();
  }
}
