-- AlterTable
ALTER TABLE "project_steps" ADD COLUMN     "actualDuration" INTEGER,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "plannedEndDate" TIMESTAMP(3),
ADD COLUMN     "plannedStartDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "actualDuration" INTEGER,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "plannedEndDate" TIMESTAMP(3),
ADD COLUMN     "plannedStartDate" TIMESTAMP(3);
