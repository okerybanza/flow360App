import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileCommentsController } from './file-comments.controller';
import { FileCommentsService } from './file-comments.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UploadService } from '../common/services/upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController, FileCommentsController],
  providers: [FilesService, FileCommentsService, UploadService],
  exports: [FilesService, FileCommentsService],
})
export class FilesModule {}
