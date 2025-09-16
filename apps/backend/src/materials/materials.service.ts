import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto) {
    const material = await this.prisma.material.create({
      data: createMaterialDto,
    });

    return material;
  }

  async findAll() {
    return this.prisma.material.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.projectMaterial.findMany({
      where: { projectId },
      include: {
        material: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  async update(id: string, updateMaterialDto: Partial<CreateMaterialDto>) {
    await this.findOne(id);

    const material = await this.prisma.material.update({
      where: { id },
      data: updateMaterialDto,
    });

    return material;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.material.delete({
      where: { id },
    });

    return { message: 'Material deleted successfully' };
  }

  // Add material to project
  async addToProject(projectId: string, materialId: string, quantity: number) {
    const material = await this.findOne(materialId);
    const totalPrice = material.price * quantity;

    const projectMaterial = await this.prisma.projectMaterial.create({
      data: {
        projectId,
        materialId,
        quantity,
        totalPrice,
      },
      include: {
        material: true,
      },
    });

    return projectMaterial;
  }

  async getStats() {
    const [
      totalMaterials,
      materialsByCategory,
      totalValue,
      averagePrice,
      materialsByCurrency,
      recentMaterials
    ] = await Promise.all([
      this.prisma.material.count(),
      this.prisma.material.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      }),
      this.prisma.material.aggregate({
        _sum: {
          price: true
        }
      }),
      this.prisma.material.aggregate({
        _avg: {
          price: true
        }
      }),
      this.prisma.material.groupBy({
        by: ['currency'],
        _count: {
          currency: true
        },
        _sum: {
          price: true
        }
      }),
      this.prisma.material.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    return {
      totalMaterials,
      materialsByCategory: materialsByCategory.reduce((acc, item) => {
        acc[item.category || 'Non catégorisé'] = item._count.category;
        return acc;
      }, {} as Record<string, number>),
      totalValue: totalValue._sum.price || 0,
      averagePrice: averagePrice._avg.price || 0,
      materialsByCurrency: materialsByCurrency.reduce((acc, item) => {
        acc[item.currency] = {
          count: item._count.currency,
          totalValue: item._sum.price || 0
        };
        return acc;
      }, {} as Record<string, { count: number; totalValue: number }>),
      recentMaterials
    };
  }
}
