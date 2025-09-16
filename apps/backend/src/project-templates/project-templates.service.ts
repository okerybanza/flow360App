import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProjectTemplateDto } from './dto/create-project-template.dto';
import { CreateTemplateStepDto } from './dto/create-template-step.dto';

@Injectable()
export class ProjectTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectTemplateDto: CreateProjectTemplateDto) {
    return this.prisma.projectTemplate.create({
      data: createProjectTemplateDto,
    });
  }

  async findAll() {
    return this.prisma.projectTemplate.findMany({
      include: {
        steps: {
          include: {
            tasks: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.projectTemplate.findUnique({
      where: { id },
      include: {
        steps: {
          include: {
            tasks: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Project template with ID ${id} not found`);
    }

    return template;
  }

  async update(id: string, updateProjectTemplateDto: Partial<CreateProjectTemplateDto>) {
    await this.findOne(id);

    return this.prisma.projectTemplate.update({
      where: { id },
      data: updateProjectTemplateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.projectTemplate.delete({
      where: { id },
    });

    return { message: 'Project template deleted successfully' };
  }

  async addStep(templateId: string, createStepDto: CreateTemplateStepDto) {
    await this.findOne(templateId);

    const { tasks, ...stepData } = createStepDto;
    
    const step = await this.prisma.projectTemplateStep.create({
      data: {
        ...stepData,
        templateId,
      },
      include: {
        tasks: true,
      },
    });

    // Create tasks if provided
    if (tasks && tasks.length > 0) {
      await Promise.all(
        tasks.map(async (task) => {
          await this.prisma.projectTemplateTask.create({
            data: {
              ...task,
              stepId: step.id,
            },
          });
        })
      );
    }

    return this.prisma.projectTemplateStep.findUnique({
      where: { id: step.id },
      include: {
        tasks: true,
      },
    });
  }

  async updateStep(templateId: string, stepId: string, updateStepDto: Partial<CreateTemplateStepDto>) {
    await this.findOne(templateId);

    const step = await this.prisma.projectTemplateStep.findFirst({
      where: {
        id: stepId,
        templateId,
      },
    });

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found in template ${templateId}`);
    }

    const { tasks, ...stepData } = updateStepDto;

    return this.prisma.projectTemplateStep.update({
      where: { id: stepId },
      data: stepData,
      include: {
        tasks: true,
      },
    });
  }

  async removeStep(templateId: string, stepId: string) {
    await this.findOne(templateId);

    const step = await this.prisma.projectTemplateStep.findFirst({
      where: {
        id: stepId,
        templateId,
      },
    });

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found in template ${templateId}`);
    }

    await this.prisma.projectTemplateStep.delete({
      where: { id: stepId },
    });

    return { message: 'Step deleted successfully' };
  }

  async createFromTemplate(templateId: string, projectId: string) {
    const template = await this.findOne(templateId);

    // Get the first admin user as the creator
    const adminUser = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      throw new Error('No admin user found to create tasks');
    }

    // First, delete all existing steps and tasks for this project
    // This will cascade delete all tasks due to the foreign key constraint
    await this.prisma.projectStep.deleteMany({
      where: { projectId }
    });

    // Now create new steps and tasks from the template
    const steps = await Promise.all(
      template.steps.map(async (step) => {
        const createdStep = await this.prisma.projectStep.create({
          data: {
            title: step.title,
            description: step.description,
            order: step.order,
            projectId,
            isCustom: false,
          },
        });

        // Create tasks for this step
        await Promise.all(
          step.tasks.map(async (task) => {
            await this.prisma.task.create({
              data: {
                title: task.title,
                description: task.description,
                order: task.order,
                stepId: createdStep.id,
                isCustom: false,
                createdBy: adminUser.id, // Use actual admin user ID
              },
            });
          })
        );

        return createdStep;
      })
    );

    return steps;
  }
}
