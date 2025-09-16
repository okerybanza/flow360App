-- Add estimated duration and actual duration to project steps
ALTER TABLE "project_steps" ADD COLUMN "estimatedDuration" INTEGER; -- in days
ALTER TABLE "project_steps" ADD COLUMN "actualDuration" INTEGER; -- in days
ALTER TABLE "project_steps" ADD COLUMN "plannedStartDate" TIMESTAMP(3);
ALTER TABLE "project_steps" ADD COLUMN "plannedEndDate" TIMESTAMP(3);

-- Add estimated duration to tasks
ALTER TABLE "tasks" ADD COLUMN "estimatedDuration" INTEGER; -- in hours
ALTER TABLE "tasks" ADD COLUMN "actualDuration" INTEGER; -- in hours
ALTER TABLE "tasks" ADD COLUMN "plannedStartDate" TIMESTAMP(3);
ALTER TABLE "tasks" ADD COLUMN "plannedEndDate" TIMESTAMP(3);
