import { Module } from '@nestjs/common';
import { ProjectTemplatesService } from './project-templates.service';
import { ProjectTemplatesController } from './project-templates.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectTemplatesController],
  providers: [ProjectTemplatesService],
  exports: [ProjectTemplatesService],
})
export class ProjectTemplatesModule {}
