-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "type" "ClientType" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "website" TEXT;
