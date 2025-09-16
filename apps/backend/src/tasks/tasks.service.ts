import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { stepId, createdBy, assignedTo, ...taskData } = createTaskDto;
    return this.prisma.task.create({
      data: {
        ...taskData,
        step: {
          connect: { id: stepId }
        },
        creator: {
          connect: { id: createdBy }
        },
        ...(assignedTo && {
          assignee: {
            connect: { id: assignedTo }
          }
        })
      },
      include: {
        assignee: true,
        creator: true,
        step: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        assignee: true,
        creator: true,
        step: {
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findByStep(stepId: string) {
    return this.prisma.task.findMany({
      where: {
        stepId,
      },
      include: {
        assignee: true,
        creator: true,
        step: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
        step: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: Partial<CreateTaskDto>) {
    const task = await this.findOne(id);

    // Update the task
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        assignee: true,
        creator: true,
        step: true,
      },
    });

    // Auto-update step status based on task completion
    await this.updateStepStatus(task.stepId);

    // Auto-update project status based on step completion
    await this.updateProjectStatus(task.step.projectId);

    return updatedTask;
  }

  private async updateStepStatus(stepId: string) {
    const step = await this.prisma.projectStep.findUnique({
      where: { id: stepId },
      include: {
        tasks: true,
      },
    });

    if (!step) return;

    const totalTasks = step.tasks.length;
    if (totalTasks === 0) return; // No tasks to evaluate

    const taskStatuses = step.tasks.map(task => task.status);
    
    let newStepStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SUSPENDED';

    // All tasks are done
    if (taskStatuses.every(status => status === 'DONE')) {
      newStepStatus = 'COMPLETED';
    } 
    // At least one task is blocked
    else if (taskStatuses.some(status => status === 'BLOCKED')) {
      newStepStatus = 'BLOCKED';
    }
    // At least one task is suspended
    else if (taskStatuses.some(status => status === 'SUSPENDED')) {
      newStepStatus = 'SUSPENDED';
    }
    // At least one task is in progress or review
    else if (taskStatuses.some(status => status === 'IN_PROGRESS' || status === 'REVIEW')) {
      newStepStatus = 'IN_PROGRESS';
    }
    // All tasks are pending
    else if (taskStatuses.every(status => status === 'TODO')) {
      newStepStatus = 'PENDING';
    }
    // Default fallback
    else {
      newStepStatus = 'PENDING';
    }

    // Only update if status changed
    if (step.status !== newStepStatus) {
      await this.prisma.projectStep.update({
        where: { id: stepId },
        data: { status: newStepStatus },
      });
    }
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

    return this.prisma.task.delete({
      where: { id },
    });
  }

  // Task Materials methods
  async addMaterials(taskId: string, materials: { materialId: string; quantity: number }[]) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { taskMaterials: true },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Get material prices for total calculation
    const materialIds = materials.map(m => m.materialId);
    const materialPrices = await this.prisma.material.findMany({
      where: { id: { in: materialIds } },
      select: { id: true, price: true },
    });

    const priceMap = new Map(materialPrices.map(m => [m.id, m.price]));

    // Create task materials with calculated total prices
    const taskMaterials = await Promise.all(
      materials.map(async (material) => {
        const price = priceMap.get(material.materialId);
        if (!price) {
          throw new Error(`Material with id ${material.materialId} not found`);
        }

        return this.prisma.taskMaterial.create({
          data: {
            taskId,
            materialId: material.materialId,
            quantity: material.quantity,
            totalPrice: price * material.quantity,
          },
          include: {
            material: true,
          },
        });
      })
    );

    return taskMaterials;
  }

  async getMaterials(taskId: string) {
    return this.prisma.taskMaterial.findMany({
      where: { taskId },
      include: {
        material: true,
      },
    });
  }

  async removeMaterial(taskId: string, materialId: string) {
    return this.prisma.taskMaterial.deleteMany({
      where: {
        taskId,
        materialId,
      },
    });
  }
}
