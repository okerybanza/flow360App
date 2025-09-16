import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async create(createFileDto: {
    name: string;
    url: string;
    type: string;
    size: number;
    projectId: string;
  }) {
    const file = await this.prisma.file.create({
      data: createFileDto,
    });

    return file;
  }

  async findAll() {
    return this.prisma.file.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        messageAttachments: {
          include: {
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
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.file.findMany({
      where: { projectId },
      include: {
        messageAttachments: {
          include: {
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
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.file.delete({
      where: { id },
    });

    return { message: 'File deleted successfully' };
  }
}
