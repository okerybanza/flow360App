import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { MaterialsModule } from './materials/materials.module';
import { FilesModule } from './files/files.module';
import { MessagesModule } from './messages/messages.module';
import { ProjectTemplatesModule } from './project-templates/project-templates.module';
import { ProjectStepsModule } from './project-steps/project-steps.module';
import { TasksModule } from './tasks/tasks.module';
import { CompanySettingsModule } from './company-settings/company-settings.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ProjectsModule,
    MaterialsModule,
    FilesModule,
    MessagesModule,
    ProjectTemplatesModule,
    ProjectStepsModule,
    TasksModule,
    CompanySettingsModule,
    SeedModule,
  ],
})
export class AppModule {}
