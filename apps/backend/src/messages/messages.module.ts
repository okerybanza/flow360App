import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageAttachmentsService } from './message-attachments.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UploadService } from '../common/services/upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageAttachmentsService, UploadService],
  exports: [MessagesService],
})
export class MessagesModule {}
