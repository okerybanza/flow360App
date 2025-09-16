import { PrismaClient, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏗️  Creating construction templates...')

  // Clear existing templates
  await prisma.projectTemplateTask.deleteMany()
  await prisma.projectTemplateStep.deleteMany()
  await prisma.projectTemplate.deleteMany()

  // 1. MAISON INDIVIDUELLE - Template complet
  const maisonTemplate = await prisma.projectTemplate.create({
    data: {
      name: 'Construction Maison Individuelle',
      description: 'Template complet pour la construction d\'une maison individuelle de A à Z',
    },
  })

  // Étapes pour Maison Individuelle
  const maisonSteps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Préparation et Terrassement',
        description: 'Préparation du terrain et terrassement',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Fondations',
        description: 'Réalisation des fondations',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Structure et Maçonnerie',
        description: 'Élévation des murs et structure',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Charpente et Couverture',
        description: 'Pose de la charpente et toiture',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Menuiseries Extérieures',
        description: 'Pose des fenêtres et portes extérieures',
        order: 5,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Isolation',
        description: 'Pose des isolants thermiques et phoniques',
        order: 6,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Plomberie et Électricité',
        description: 'Installation des réseaux',
        order: 7,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Plâtrerie et Enduits',
        description: 'Finition des murs et plafonds',
        order: 8,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Menuiseries Intérieures',
        description: 'Pose des portes intérieures et escaliers',
        order: 9,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Carrelage et Sols',
        description: 'Pose des revêtements de sol',
        order: 10,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Peinture et Finitions',
        description: 'Peinture et finitions intérieures',
        order: 11,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: maisonTemplate.id,
        title: 'Aménagements Extérieurs',
        description: 'Terrassement, allées, clôtures',
        order: 12,
      },
    }),
  ])

  // Tâches détaillées pour chaque étape
  await Promise.all([
    // Préparation et Terrassement
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[0].id, title: 'Délimitation du terrain', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[0].id, title: 'Abattage des arbres si nécessaire', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[0].id, title: 'Décaissement et terrassement', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[0].id, title: 'Mise en place des accès chantier', order: 4 },
    }),

    // Fondations
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Implantation et piquetage', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Fouilles en rigoles', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Pose du film géotextile', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Mise en place du hérisson', order: 4 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Coulage des semelles filantes', order: 5 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[1].id, title: 'Pose des longrines', order: 6 },
    }),

    // Structure et Maçonnerie
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[2].id, title: 'Élévation des murs de soubassement', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[2].id, title: 'Pose du plancher bas', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[2].id, title: 'Élévation des murs porteurs', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[2].id, title: 'Pose des linteaux', order: 4 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[2].id, title: 'Pose du plancher haut', order: 5 },
    }),

    // Charpente et Couverture
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[3].id, title: 'Pose de la charpente', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[3].id, title: 'Pose des liteaux', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[3].id, title: 'Pose des tuiles', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[3].id, title: 'Pose de la zinguerie', order: 4 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[3].id, title: 'Installation des chéneaux', order: 5 },
    }),

    // Menuiseries Extérieures
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[4].id, title: 'Pose des fenêtres', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[4].id, title: 'Pose de la porte d\'entrée', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[4].id, title: 'Pose de la porte de garage', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[4].id, title: 'Pose des volets roulants', order: 4 },
    }),

    // Isolation
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[5].id, title: 'Isolation des murs extérieurs', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[5].id, title: 'Isolation de la toiture', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[5].id, title: 'Isolation des planchers', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[5].id, title: 'Pose du pare-vapeur', order: 4 },
    }),

    // Plomberie et Électricité
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[6].id, title: 'Installation électrique', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[6].id, title: 'Installation plomberie', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[6].id, title: 'Installation chauffage', order: 3 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[6].id, title: 'Installation VMC', order: 4 },
    }),

    // Plâtrerie et Enduits
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[7].id, title: 'Pose des cloisons', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[7].id, title: 'Enduits intérieurs', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[7].id, title: 'Pose des plafonds', order: 3 },
    }),

    // Menuiseries Intérieures
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[8].id, title: 'Pose des portes intérieures', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[8].id, title: 'Pose de l\'escalier', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[8].id, title: 'Pose des plinthes', order: 3 },
    }),

    // Carrelage et Sols
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[9].id, title: 'Carrelage salle de bain', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[9].id, title: 'Carrelage cuisine', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[9].id, title: 'Pose parquet/sols souples', order: 3 },
    }),

    // Peinture et Finitions
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[10].id, title: 'Peinture plafonds', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[10].id, title: 'Peinture murs', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[10].id, title: 'Peinture menuiseries', order: 3 },
    }),

    // Aménagements Extérieurs
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[11].id, title: 'Terrassement extérieur', order: 1 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[11].id, title: 'Pose des allées', order: 2 },
    }),
    prisma.projectTemplateTask.create({
      data: { stepId: maisonSteps[11].id, title: 'Installation clôture', order: 3 },
    }),
  ])

  // 2. RÉNOVATION COMPLÈTE
  const renovationTemplate = await prisma.projectTemplate.create({
    data: {
      name: 'Rénovation Complète',
      description: 'Template pour rénovation complète d\'un bâtiment existant',
    },
  })

  const renovationSteps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Diagnostic et Désamiantage',
        description: 'Analyse du bâtiment et désamiantage si nécessaire',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Démolition',
        description: 'Démolition des éléments à remplacer',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Renforcement Structure',
        description: 'Renforcement de la structure si nécessaire',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Isolation Thermique',
        description: 'Mise aux normes thermiques',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Menuiseries',
        description: 'Remplacement des menuiseries',
        order: 5,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Installations',
        description: 'Mise aux normes des installations',
        order: 6,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: renovationTemplate.id,
        title: 'Finitions',
        description: 'Finitions intérieures',
        order: 7,
      },
    }),
  ])

  // 3. EXTENSION MAISON
  const extensionTemplate = await prisma.projectTemplate.create({
    data: {
      name: 'Extension Maison',
      description: 'Template pour extension d\'une maison existante',
    },
  })

  const extensionSteps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: extensionTemplate.id,
        title: 'Préparation',
        description: 'Préparation du chantier et raccordements',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: extensionTemplate.id,
        title: 'Fondations Extension',
        description: 'Réalisation des fondations de l\'extension',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: extensionTemplate.id,
        title: 'Structure Extension',
        description: 'Construction de la structure de l\'extension',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: extensionTemplate.id,
        title: 'Raccordement',
        description: 'Raccordement à l\'existant',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: extensionTemplate.id,
        title: 'Finitions Extension',
        description: 'Finitions de l\'extension',
        order: 5,
      },
    }),
  ])

  // 4. BÂTIMENT COMMERCIAL
  const commercialTemplate = await prisma.projectTemplate.create({
    data: {
      name: 'Bâtiment Commercial',
      description: 'Template pour construction de bâtiment commercial',
    },
  })

  const commercialSteps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Terrassement',
        description: 'Terrassement et fondations',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Structure',
        description: 'Structure béton armé',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Façades',
        description: 'Pose des façades',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Toiture',
        description: 'Pose de la toiture',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Installations',
        description: 'Installations techniques',
        order: 5,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: commercialTemplate.id,
        title: 'Aménagements',
        description: 'Aménagements intérieurs',
        order: 6,
      },
    }),
  ])

  // 5. RÉNOVATION ÉNERGÉTIQUE
  const energetiqueTemplate = await prisma.projectTemplate.create({
    data: {
      name: 'Rénovation Énergétique',
      description: 'Template pour rénovation énergétique',
    },
  })

  const energetiqueSteps = await Promise.all([
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Audit Énergétique',
        description: 'Diagnostic de performance énergétique',
        order: 1,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Isolation Toiture',
        description: 'Isolation de la toiture',
        order: 2,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Isolation Murs',
        description: 'Isolation des murs extérieurs',
        order: 3,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Menuiseries',
        description: 'Remplacement des menuiseries',
        order: 4,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Chauffage',
        description: 'Remplacement du système de chauffage',
        order: 5,
      },
    }),
    prisma.projectTemplateStep.create({
      data: {
        templateId: energetiqueTemplate.id,
        title: 'Ventilation',
        description: 'Installation VMC double flux',
        order: 6,
      },
    }),
  ])

  console.log('✅ Construction templates created successfully!')
  console.log(`📋 Created ${5} templates:`)
  console.log('  - Construction Maison Individuelle (12 étapes)')
  console.log('  - Rénovation Complète (7 étapes)')
  console.log('  - Extension Maison (5 étapes)')
  console.log('  - Bâtiment Commercial (6 étapes)')
  console.log('  - Rénovation Énergétique (6 étapes)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
