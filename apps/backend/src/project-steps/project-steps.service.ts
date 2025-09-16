import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProjectStepDto } from './dto/create-project-step.dto';

@Injectable()
export class ProjectStepsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectStepDto: CreateProjectStepDto) {
    const { projectId, ...stepData } = createProjectStepDto;
    return this.prisma.projectStep.create({
      data: {
        ...stepData,
        project: {
          connect: { id: projectId }
        }
      },
      include: {
        tasks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.projectStep.findMany({
      include: {
        project: true,
        tasks: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.projectStep.findMany({
      where: {
        projectId,
      },
      include: {
        tasks: {
          include: {
            assignee: true,
            creator: true,
            taskMaterials: {
              include: {
                material: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const step = await this.prisma.projectStep.findUnique({
      where: { id },
      include: {
        project: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
            taskMaterials: {
              include: {
                material: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!step) {
      throw new NotFoundException(`Project step with ID ${id} not found`);
    }

    return step;
  }

  async update(id: string, updateProjectStepDto: Partial<CreateProjectStepDto>) {
    const step = await this.findOne(id);

    const updatedStep = await this.prisma.projectStep.update({
      where: { id },
      data: updateProjectStepDto,
      include: {
        tasks: true,
      },
    });

    // Auto-update project status based on step changes
    await this.updateProjectStatus(step.projectId);

        return updatedStep;
  }

  private async updateProjectStatus(projectId: string) {
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

    if (!project) return;

    const totalSteps = project.steps.length;
    if (totalSteps === 0) return; // No steps to evaluate

    const stepStatuses = project.steps.map(step => step.status);
    
    let newProjectStatus: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';

    // All steps are completed
    if (stepStatuses.every(status => status === 'COMPLETED')) {
      newProjectStatus = 'COMPLETED';
    } 
    // At least one step is blocked or suspended
    else if (stepStatuses.some(status => status === 'BLOCKED' || status === 'SUSPENDED')) {
      newProjectStatus = 'SUSPENDED';
    }
    // At least one step is in progress
    else if (stepStatuses.some(status => status === 'IN_PROGRESS')) {
      newProjectStatus = 'IN_PROGRESS';
    }
    // All steps are pending
    else if (stepStatuses.every(status => status === 'PENDING')) {
      newProjectStatus = 'DRAFT';
    }
    // Default fallback
    else {
      newProjectStatus = 'DRAFT';
    }

    // Only update if status changed
    if (project.status !== newProjectStatus) {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: newProjectStatus },
      });
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.projectStep.delete({
      where: { id },
    });
  }
}
