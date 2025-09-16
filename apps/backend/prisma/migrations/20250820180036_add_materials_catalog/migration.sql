/*
  Warnings:

  - You are about to drop the column `projectId` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `materials` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_projectId_fkey";

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "projectId",
DROP COLUMN "quantity",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT;

-- CreateTable
CREATE TABLE "project_materials" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "materialId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_materials" ADD CONSTRAINT "project_materials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
