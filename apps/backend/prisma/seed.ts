import { PrismaClient, UserRole, ClientStatus, ClientType, ProjectStatus, TaskStatus, Priority, Currency } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.taskMaterial.deleteMany()
  await prisma.projectMaterial.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectStep.deleteMany()
  await prisma.projectTemplateStep.deleteMany()
  await prisma.projectTemplate.deleteMany()
  await prisma.message.deleteMany()
  await prisma.file.deleteMany()
  await prisma.material.deleteMany()
  await prisma.project.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()
  await prisma.companySettings.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create company settings
  const companySettings = await prisma.companySettings.create({
    data: {
      name: '360Flow Construction',
      email: 'contact@360flow.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la Construction, 75001 Paris',
      currency: 'USD',
    },
  })

  console.log('🏢 Created company settings')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@360flow.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      avatarUrl: null,
    },
  })

  console.log('👤 Created admin user')

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@360flow.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ARCHITECT,
      avatarUrl: null,
    },
  })

  console.log('👤 Created regular user')

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      address: '456 Avenue des Architectes, 75002 Paris',
      status: ClientStatus.ACTIVE,
      type: ClientType.INDIVIDUAL,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'pierre.martin@construction.com',
      phone: '+33 6 98 76 54 32',
      address: '789 Boulevard des Entrepreneurs, 75003 Paris',
      status: ClientStatus.ACTIVE,
      type: ClientType.COMPANY,
      companyName: 'Construction Martin SARL',
      website: 'construction-martin.com',
    },
  })

  console.log('👥 Created clients')

  // Create materials
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: 'Ciment Portland',
        brand: 'Lafarge',
        unit: 'Sac',
        price: 8.50,
        currency: Currency.USD,
        category: 'Matériaux de base',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Briques creuses',
        brand: 'Wienerberger',
        unit: 'm²',
        price: 45.00,
        currency: Currency.USD,
        category: 'Maçonnerie',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Acier de construction',
        brand: 'ArcelorMittal',
        unit: 'Tonne',
        price: 850.00,
        currency: Currency.USD,
        category: 'Structure',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Isolation thermique',
        brand: 'Isover',
        unit: 'm²',
        price: 12.50,
        currency: Currency.USD,
        category: 'Isolation',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Peinture intérieure',
        brand: 'Dulux',
        unit: 'Litre',
        price: 18.75,
        currency: Currency.USD,
        category: 'Finitions',
      },
    }),
  ])

  console.log('🧱 Created materials')

  // Create project template
  const template = await prisma.projectTemplate.create({
    data: {
      name: 'Construction Maison Standard',
      description: 'Template pour la construction d\'une maison individuelle',
    },
  })

  console.log('📋 Created project template')

  // Create template steps
  const steps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: template.id,
        title: 'Fondations',
        description: 'Préparation et coulage des fondations',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: template.id,
        title: 'Structure',
        description: 'Élévation des murs et charpente',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: template.id,
        title: 'Couverture',
        description: 'Pose de la toiture et zinguerie',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: template.id,
        title: 'Isolation',
        description: 'Pose des isolants thermiques et phoniques',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: template.id,
        title: 'Finitions',
        description: 'Peinture, carrelage et aménagements',
        order: 5,
      },
    }),
  ])

  console.log('📝 Created template steps')

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Maison Dubois - Construction complète',
      description: 'Construction d\'une maison individuelle de 120m²',
      budget: 180000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-08-15'),
      status: ProjectStatus.IN_PROGRESS,
      clientId: client1.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Bureau Martin - Rénovation',
      description: 'Rénovation complète des bureaux de Construction Martin',
      budget: 75000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      status: ProjectStatus.DRAFT,
      clientId: client2.id,
    },
  })

  console.log('🏗️  Created projects')

  // Apply template to project1
  await prisma.projectTemplateStep.findMany({
    where: { templateId: template.id },
    orderBy: { order: 'asc' },
  }).then(async (templateSteps) => {
    for (const templateStep of templateSteps) {
      const projectStep = await prisma.projectStep.create({
        data: {
          projectId: project1.id,
          title: templateStep.title,
          description: templateStep.description,
          order: templateStep.order,
          status: templateStep.order <= 2 ? 'IN_PROGRESS' : 'PENDING',
        },
      })

      // Create tasks for each step
      const tasksData = [
        {
          title: 'Préparation du terrain',
          description: 'Déblaiement et nivellement',
          order: 1,
          status: 'DONE' as TaskStatus,
          priority: 'HIGH' as Priority,
        },
        {
          title: 'Coulage des fondations',
          description: 'Coulage du béton armé',
          order: 2,
          status: 'DONE' as TaskStatus,
          priority: 'HIGH' as Priority,
        },
        {
          title: 'Séchage et contrôle',
          description: 'Contrôle qualité des fondations',
          order: 3,
          status: 'IN_PROGRESS' as TaskStatus,
          priority: 'MEDIUM' as Priority,
        },
      ]

      for (const taskData of tasksData) {
        await prisma.task.create({
          data: {
            ...taskData,
            stepId: projectStep.id,
            createdBy: adminUser.id,
            assignedTo: regularUser.id,
          },
        })
      }
    }
  })

  console.log('✅ Applied template to project and created tasks')

  // Add some materials to tasks
  const tasks = await prisma.task.findMany({
    where: { step: { projectId: project1.id } },
    take: 3,
  })

  if (tasks.length > 0) {
    await prisma.taskMaterial.create({
      data: {
        taskId: tasks[0].id,
        materialId: materials[0].id, // Ciment
        quantity: 50,
        totalPrice: 50 * materials[0].price,
      },
    })

    await prisma.taskMaterial.create({
      data: {
        taskId: tasks[1].id,
        materialId: materials[1].id, // Briques
        quantity: 200,
        totalPrice: 200 * materials[1].price,
      },
    })

    await prisma.taskMaterial.create({
      data: {
        taskId: tasks[2].id,
        materialId: materials[2].id, // Acier
        quantity: 2.5,
        totalPrice: 2.5 * materials[2].price,
      },
    })
  }

  console.log('📦 Added materials to tasks')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
