import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UploadService } from '../common/services/upload.service';

@Injectable()
export class MessageAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}

  async attachFileToMessage(
    messageId: string,
    file: Express.Multer.File,
    userId: string
  ) {
    // Vérifier que le message existe
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { project: true }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Upload le fichier
    const uploadResult = await this.uploadService.uploadFile(
      file,
      this.uploadService.getGenericFileConfig()
    );

    // Créer l'entrée File
    const fileRecord = await this.prisma.file.create({
      data: {
        name: file.originalname,
        url: uploadResult.path,
        type: file.mimetype,
        size: file.size,
        projectId: message.projectId
      }
    });

    // Lier le fichier au message
    const messageFile = await this.prisma.messageFile.create({
      data: {
        messageId,
        fileId: fileRecord.id
      },
      include: {
        file: true
      }
    });

    return messageFile;
  }

  async getMessageAttachments(messageId: string) {
    return this.prisma.messageFile.findMany({
      where: { messageId },
      include: {
        file: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async removeAttachment(messageId: string, fileId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new BadRequestException('You can only remove attachments from your own messages');
    }

    await this.prisma.messageFile.delete({
      where: {
        messageId_fileId: {
          messageId,
          fileId
        }
      }
    });

    return { message: 'Attachment removed successfully' };
  }

  async getProjectFilesFromMessages(projectId: string) {
    const messageFiles = await this.prisma.messageFile.findMany({
      where: {
        message: {
          projectId
        }
      },
      include: {
        file: true,
        message: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const fileMap = new Map();
    
    messageFiles.forEach(messageFile => {
      const fileId = messageFile.fileId;
      if (!fileMap.has(fileId)) {
        fileMap.set(fileId, {
          ...messageFile.file,
          messageAttachments: []
        });
      }
      
      fileMap.get(fileId).messageAttachments.push({
        messageId: messageFile.messageId,
        messageContent: messageFile.message.content,
        messageUser: messageFile.message.user,
        attachedAt: messageFile.createdAt
      });
    });

    return Array.from(fileMap.values());
  }
}
