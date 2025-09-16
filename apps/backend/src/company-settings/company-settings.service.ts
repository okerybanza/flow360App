import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCompanySettingsDto } from './dto/create-company-settings.dto';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';

@Injectable()
export class CompanySettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanySettingsDto: CreateCompanySettingsDto) {
    return this.prisma.companySettings.create({
      data: createCompanySettingsDto,
    });
  }

  async findOne() {
    const settings = await this.prisma.companySettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      return this.prisma.companySettings.create({
        data: {
          name: '360Flow Architecture',
          primaryColor: '#1e40af',
          secondaryColor: '#64748b',
          accentColor: '#0ea5e9',
          email: 'contact@360flow.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue de la Paix, 75001 Paris, France',
          website: 'https://360flow.com',
          currency: 'EUR',
        },
      });
    }
    
    return settings;
  }

  async update(updateCompanySettingsDto: UpdateCompanySettingsDto) {
    const existing = await this.prisma.companySettings.findFirst();
    
    if (!existing) {
      // If no settings exist, create with required fields
      const createData: CreateCompanySettingsDto = {
        name: updateCompanySettingsDto.name || '360Flow Architecture',
        primaryColor: updateCompanySettingsDto.primaryColor || '#1e40af',
        secondaryColor: updateCompanySettingsDto.secondaryColor || '#64748b',
        accentColor: updateCompanySettingsDto.accentColor || '#0ea5e9',
        currency: updateCompanySettingsDto.currency || 'EUR',
        logo: updateCompanySettingsDto.logo,
        email: updateCompanySettingsDto.email,
        phone: updateCompanySettingsDto.phone,
        address: updateCompanySettingsDto.address,
        website: updateCompanySettingsDto.website,
      };
      return this.create(createData);
    }
    
    return this.prisma.companySettings.update({
      where: { id: existing.id },
      data: updateCompanySettingsDto,
    });
  }

  async remove() {
    const settings = await this.prisma.companySettings.findFirst();
    if (!settings) {
      throw new NotFoundException('Company settings not found');
    }
    
    return this.prisma.companySettings.delete({
      where: { id: settings.id },
    });
  }
}
