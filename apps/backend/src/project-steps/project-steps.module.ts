import { Module } from '@nestjs/common';
import { ProjectStepsService } from './project-steps.service';
import { ProjectStepsController } from './project-steps.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectStepsController],
  providers: [ProjectStepsService],
  exports: [ProjectStepsService],
})
export class ProjectStepsModule {}
