import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const clients = [
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris',
    status: 'ACTIVE' as const
  },
  {
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.com',
    phone: '+33 1 98 76 54 32',
    address: '456 Avenue des Champs, 75008 Paris',
    status: 'ACTIVE' as const
  },
  {
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@email.com',
    phone: '+33 1 45 67 89 12',
    address: '789 Boulevard Saint-Germain, 75006 Paris',
    status: 'ACTIVE' as const
  }
]

const projects = [
  {
    title: 'Rénovation Appartement Haussmannien',
    description: 'Rénovation complète d\'un appartement de 120m² dans un immeuble haussmannien du 8ème arrondissement',
    status: 'IN_PROGRESS' as const,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-08-30'),
    budget: 150000
  },
  {
    title: 'Construction Maison Contemporaine',
    description: 'Construction d\'une maison moderne de 200m² avec jardin paysager',
    status: 'IN_PROGRESS' as const,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-12-31'),
    budget: 450000
  },
  {
    title: 'Aménagement Bureau Design',
    description: 'Aménagement d\'un espace de travail moderne pour une startup tech',
    status: 'DRAFT' as const,
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-07-31'),
    budget: 80000
  }
]

const materials = [
  {
    name: 'Ciment Portland',
    brand: 'Lafarge',
    unit: 'kg',
    price: 0.15,
    quantity: 5000,
    category: 'Matériaux de construction'
  },
  {
    name: 'Briques de parement',
    brand: 'Wienerberger',
    unit: 'm²',
    price: 45.00,
    quantity: 80,
    category: 'Matériaux de construction'
  },
  {
    name: 'Parquet chêne massif',
    brand: 'Tarkett',
    unit: 'm²',
    price: 85.00,
    quantity: 120,
    category: 'Revêtements de sol'
  },
  {
    name: 'Isolation thermique',
    brand: 'Isover',
    unit: 'm²',
    price: 12.50,
    quantity: 200,
    category: 'Isolation'
  },
  {
    name: 'Peinture murale',
    brand: 'Dulux',
    unit: 'l',
    price: 25.00,
    quantity: 50,
    category: 'Peintures'
  },
  {
    name: 'Carrelage céramique',
    brand: 'Porcelanosa',
    unit: 'm²',
    price: 35.00,
    quantity: 60,
    category: 'Revêtements muraux'
  }
]

const files = [
  {
    name: 'plans_renovation.pdf',
    type: 'application/pdf',
    size: 2048576,
    url: '/uploads/plans_renovation.pdf'
  },
  {
    name: 'photo_avant.jpg',
    type: 'image/jpeg',
    size: 1048576,
    url: '/uploads/photo_avant.jpg'
  },
  {
    name: 'devis_construction.pdf',
    type: 'application/pdf',
    size: 1536000,
    url: '/uploads/devis_construction.pdf'
  }
]

const messages = [
  {
    content: 'Bonjour ! Je suis ravi de commencer ce projet de rénovation avec vous. Pouvez-vous me donner plus de détails sur le planning ?',
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    content: 'Bien sûr ! Nous prévoyons de commencer les travaux le 1er mars. Je vous enverrai un planning détaillé dans la semaine.',
    createdAt: new Date('2024-01-15T11:15:00Z')
  },
  {
    content: 'Parfait ! Et concernant les matériaux, avez-vous des préférences particulières ?',
    createdAt: new Date('2024-01-15T14:20:00Z')
  },
  {
    content: 'Je préfère des matériaux de qualité premium. Le budget n\'est pas un problème pour avoir le meilleur résultat.',
    createdAt: new Date('2024-01-15T16:45:00Z')
  },
  {
    content: 'Excellent choix ! Je vais préparer une liste de matériaux premium pour votre validation.',
    createdAt: new Date('2024-01-16T09:30:00Z')
  }
]

// Default project templates
const defaultTemplates = [
  {
    name: 'Projet résidentiel',
    description: 'Template pour projets résidentiels (maisons, appartements)',
    isDefault: true,
    steps: [
      {
        title: 'Phase de conception',
        description: 'Études préliminaires et plans',
        order: 1,
        tasks: [
          { title: 'Rencontre client et analyse des besoins', order: 1 },
          { title: 'Études de faisabilité', order: 2 },
          { title: 'Création des plans conceptuels', order: 3 },
          { title: 'Validation avec le client', order: 4 }
        ]
      },
      {
        title: 'Permis de construire',
        description: 'Dossier administratif',
        order: 2,
        tasks: [
          { title: 'Préparation du dossier', order: 1 },
          { title: 'Dépôt en mairie', order: 2 },
          { title: 'Suivi administratif', order: 3 },
          { title: 'Obtention du permis', order: 4 }
        ]
      },
      {
        title: 'Appels d\'offres',
        description: 'Sélection des prestataires',
        order: 3,
        tasks: [
          { title: 'Rédaction des cahiers des charges', order: 1 },
          { title: 'Envoi des appels d\'offres', order: 2 },
          { title: 'Analyse des devis', order: 3 },
          { title: 'Sélection des entreprises', order: 4 }
        ]
      },
      {
        title: 'Phase de construction',
        description: 'Suivi de chantier',
        order: 4,
        tasks: [
          { title: 'Planification des travaux', order: 1 },
          { title: 'Coordination des intervenants', order: 2 },
          { title: 'Suivi qualité', order: 3 },
          { title: 'Gestion des imprévus', order: 4 }
        ]
      },
      {
        title: 'Réception des travaux',
        description: 'Finalisation du projet',
        order: 5,
        tasks: [
          { title: 'Contrôle final', order: 1 },
          { title: 'Réception provisoire', order: 2 },
          { title: 'Réception définitive', order: 3 },
          { title: 'Remise des clés', order: 4 }
        ]
      }
    ]
  },
  {
    name: 'Projet commercial',
    description: 'Template pour projets commerciaux (bureaux, magasins)',
    isDefault: false,
    steps: [
      {
        title: 'Études de marché',
        description: 'Analyse de la viabilité commerciale',
        order: 1,
        tasks: [
          { title: 'Analyse de la concurrence', order: 1 },
          { title: 'Étude de la clientèle cible', order: 2 },
          { title: 'Évaluation du potentiel commercial', order: 3 }
        ]
      },
      {
        title: 'Phase de conception',
        description: 'Plans et études techniques',
        order: 2,
        tasks: [
          { title: 'Plans architecturaux', order: 1 },
          { title: 'Études techniques', order: 2 },
          { title: 'Plans d\'aménagement', order: 3 }
        ]
      },
      {
        title: 'Autorisations',
        description: 'Permis et autorisations nécessaires',
        order: 3,
        tasks: [
          { title: 'Permis de construire', order: 1 },
          { title: 'Autorisation d\'exploitation', order: 2 },
          { title: 'Certificat d\'urbanisme', order: 3 }
        ]
      },
      {
        title: 'Construction',
        description: 'Réalisation des travaux',
        order: 4,
        tasks: [
          { title: 'Gros œuvre', order: 1 },
          { title: 'Second œuvre', order: 2 },
          { title: 'Finitions', order: 3 }
        ]
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.projectMaterial.deleteMany()
  await prisma.file.deleteMany()
  await prisma.material.deleteMany()
  await prisma.project.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()
  await prisma.projectTemplateTask.deleteMany()
  await prisma.projectTemplateStep.deleteMany()
  await prisma.projectTemplate.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@360flow.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  })
  console.log('✅ Created admin user')

  // Create clients
  const createdClients = []
  for (const client of clients) {
    const createdClient = await prisma.client.create({
      data: client
    })
    createdClients.push(createdClient)
  }
  console.log('✅ Created clients')

  // Create projects with client relationships
  const createdProjects = []
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    const client = createdClients[i % createdClients.length]
    
    const createdProject = await prisma.project.create({
      data: {
        ...project,
        clientId: client.id
      }
    })
    createdProjects.push(createdProject)
  }
  console.log('✅ Created projects')

  // Create materials catalog first
  const createdMaterialsCatalog = []
  for (const material of materials) {
    const { quantity, ...materialData } = material // Remove quantity from catalog
    const createdMaterial = await prisma.material.create({
      data: materialData
    })
    createdMaterialsCatalog.push(createdMaterial)
  }
  console.log('✅ Created materials catalog')

  // Create project materials with relationships
  for (let i = 0; i < materials.length; i++) {
    const material = materials[i]
    const project = createdProjects[i % createdProjects.length]
    const catalogMaterial = createdMaterialsCatalog[i % createdMaterialsCatalog.length]
    
    await prisma.projectMaterial.create({
      data: {
        materialId: catalogMaterial.id,
        projectId: project.id,
        quantity: material.quantity,
        totalPrice: material.price * material.quantity
      }
    })
  }
  console.log('✅ Created project materials')

  // Create files with project relationships
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const project = createdProjects[i % createdProjects.length]
    
    await prisma.file.create({
      data: {
        ...file,
        projectId: project.id
      }
    })
  }
  console.log('✅ Created files')

  // Create messages with project and user relationships
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const project = createdProjects[i % createdProjects.length]
    
    await prisma.message.create({
      data: {
        ...message,
        projectId: project.id,
        userId: adminUser.id
      }
    })
  }
  console.log('✅ Created messages')

  // Create project templates
  for (const template of defaultTemplates) {
    const { steps, ...templateData } = template
    const createdTemplate = await prisma.projectTemplate.create({
      data: templateData
    })

    for (const step of steps) {
      const { tasks, ...stepData } = step
      const createdStep = await prisma.projectTemplateStep.create({
        data: {
          ...stepData,
          templateId: createdTemplate.id
        }
      })

      for (const task of tasks) {
        await prisma.projectTemplateTask.create({
          data: {
            ...task,
            stepId: createdStep.id
          }
        })
      }
    }
  }
  console.log('✅ Created project templates')

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created 1 admin user, ${clients.length} clients, ${projects.length} projects, ${materials.length} materials, ${files.length} files, ${messages.length} messages, and ${defaultTemplates.length} templates`)
  console.log(`🔑 Admin login: admin@360flow.com / password123`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
