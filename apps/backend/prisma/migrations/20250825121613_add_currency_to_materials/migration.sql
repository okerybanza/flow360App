-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'CDF');

-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "project_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "project_template_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "project_template_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_steps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stepId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1e40af',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
    "accentColor" TEXT NOT NULL DEFAULT '#0ea5e9',
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "project_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_steps" ADD CONSTRAINT "project_template_steps_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "project_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_tasks" ADD CONSTRAINT "project_template_tasks_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "project_template_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_steps" ADD CONSTRAINT "project_steps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "project_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
