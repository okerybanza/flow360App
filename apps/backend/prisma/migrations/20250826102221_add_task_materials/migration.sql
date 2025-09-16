-- CreateTable
CREATE TABLE "task_materials" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "materialId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "task_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_materials" ADD CONSTRAINT "task_materials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_materials" ADD CONSTRAINT "task_materials_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
