import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: {
    content: string;
    projectId: string;
    userId: string;
  }) {
    const message = await this.prisma.message.create({
      data: createMessageDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        attachments: {
          include: {
            file: true
          }
        }
      },
    });

    return message;
  }

  async findByProject(projectId: string) {
    return this.prisma.message.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        attachments: {
          include: {
            file: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        attachments: {
          include: {
            file: true
          }
        }
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async update(id: string, updateMessageDto: { content: string }) {
    await this.findOne(id);

    const message = await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return message;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.message.delete({
      where: { id },
    });

    return { message: 'Message deleted successfully' };
  }
}
