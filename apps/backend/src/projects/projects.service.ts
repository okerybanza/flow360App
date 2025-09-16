import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const { memberIds, startDate, endDate, ...projectData } = createProjectDto;

    // Convert dates to ISO format if they exist
    const formattedData = {
      ...projectData,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    };

    const project = await this.prisma.project.create({
      data: {
        ...formattedData,
        members: memberIds && memberIds.length > 0 ? {
          connect: memberIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            projectMaterials: true,
            files: true,
            messages: true,
          },
        },
      },
    });

    return project;
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            projectMaterials: true,
            files: true,
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        projectMaterials: {
          include: {
            material: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        files: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        messages: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            projectMaterials: true,
            files: true,
            messages: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    const { memberIds, startDate, endDate, ...projectData } = updateProjectDto;

    // Convert dates to ISO format if they exist
    const formattedData = {
      ...projectData,
      startDate: startDate ? new Date(startDate + 'T00:00:00.000Z').toISOString() : undefined,
      endDate: endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : undefined,
    };

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...formattedData,
        members: memberIds && memberIds.length > 0 ? {
          set: memberIds.map(id => ({ id })),
        } : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            projectMaterials: true,
            files: true,
            messages: true,
          },
        },
      },
    });

    return project;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  async getStats() {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      plannedProjects,
      onHoldProjects,
      totalBudget,
      averageBudget,
      materialsCount,
      filesCount,
      messagesCount,
      recentProjects,
      projectsByStatus,
      projectsByMonth
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({
        where: { status: 'IN_PROGRESS' },
      }),
      this.prisma.project.count({
        where: { status: 'COMPLETED' },
      }),
      this.prisma.project.count({
        where: { status: 'DRAFT' },
      }),
      this.prisma.project.count({
        where: { status: 'CANCELLED' },
      }),
      this.prisma.project.aggregate({
        _sum: {
          budget: true,
        },
      }),
      this.prisma.project.aggregate({
        _avg: {
          budget: true,
        },
      }),
      this.prisma.projectMaterial.count(),
      this.prisma.file.count(),
      this.prisma.message.count(),
      this.prisma.project.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      this.prisma.project.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      this.prisma.project.groupBy({
        by: ['status'],
        _sum: {
          budget: true
        }
      })
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      plannedProjects,
      onHoldProjects,
      totalBudget: totalBudget._sum.budget || 0,
      averageBudget: averageBudget._avg.budget || 0,
      materialsCount,
      filesCount,
      messagesCount,
      recentProjects,
      projectsByStatus: projectsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      budgetByStatus: projectsByMonth.reduce((acc, item) => {
        acc[item.status] = item._sum.budget || 0;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  async calculateAutomaticStatus(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        steps: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const totalSteps = project.steps.length;
    if (totalSteps === 0) {
      return { automaticStatus: 'DRAFT', reason: 'Aucune étape définie' };
    }

    const stepStatuses = project.steps.map(step => step.status);
    
    let automaticStatus: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';
    let reason: string;

    // All steps are completed
    if (stepStatuses.every(status => status === 'COMPLETED')) {
      automaticStatus = 'COMPLETED';
      reason = 'Toutes les étapes sont terminées';
    } 
    // At least one step is blocked or suspended
    else if (stepStatuses.some(status => status === 'BLOCKED' || status === 'SUSPENDED')) {
      automaticStatus = 'SUSPENDED';
      reason = 'Au moins une étape est bloquée ou suspendue';
    }
    // At least one step is in progress
    else if (stepStatuses.some(status => status === 'IN_PROGRESS')) {
      automaticStatus = 'IN_PROGRESS';
      reason = 'Au moins une étape est en cours';
    }
    // All steps are pending
    else if (stepStatuses.every(status => status === 'PENDING')) {
      automaticStatus = 'DRAFT';
      reason = 'Toutes les étapes sont en attente';
    }
    // Default fallback
    else {
      automaticStatus = 'DRAFT';
      reason = 'Statut par défaut';
    }

    return { automaticStatus, reason };
  }
}
