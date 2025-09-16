import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  private formatWebsiteUrl(website?: string): string | undefined {
    if (!website) return undefined;
    
    // Remove any existing protocol
    let cleanUrl = website.replace(/^https?:\/\//, '');
    
    // Remove www. if present
    cleanUrl = cleanUrl.replace(/^www\./, '');
    
    // Add https:// protocol
    return `https://${cleanUrl}`;
  }

  async create(createClientDto: CreateClientDto) {
    const { email } = createClientDto;

    // Check if client already exists
    const existingClient = await this.prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      throw new ConflictException('Client already exists');
    }

    // Format website URL if provided
    const dataToCreate = {
      ...createClientDto,
      website: this.formatWebsiteUrl(createClientDto.website)
    };

    const client = await this.prisma.client.create({
      data: dataToCreate,
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    return client;
  }

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            budget: true,
            startDate: true,
            endDate: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    // Format website URL if provided
    const dataToUpdate = {
      ...updateClientDto,
      website: this.formatWebsiteUrl(updateClientDto.website)
    };

    const client = await this.prisma.client.update({
      where: { id },
      data: dataToUpdate,
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    return client;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.client.delete({
      where: { id },
    });

    return { message: 'Client deleted successfully' };
  }

  async getStats() {
    const [
      totalClients,
      activeClients,
      inactiveClients,
      totalProjects,
      clientsWithProjects,
      recentClients,
      clientsByMonth
    ] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.client.count({
        where: { status: 'ACTIVE' },
      }),
      this.prisma.client.count({
        where: { status: 'INACTIVE' },
      }),
      this.prisma.project.count(),
      this.prisma.client.count({
        where: {
          projects: {
            some: {}
          }
        }
      }),
      this.prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      this.prisma.client.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      })
    ]);

    return {
      totalClients,
      activeClients,
      inactiveClients,
      totalProjects,
      clientsWithProjects,
      recentClients,
      clientsByStatus: clientsByMonth.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
