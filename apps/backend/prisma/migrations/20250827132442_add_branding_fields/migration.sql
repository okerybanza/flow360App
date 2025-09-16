-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN     "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "dangerColor" TEXT NOT NULL DEFAULT '#ef4444',
ADD COLUMN     "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "successColor" TEXT NOT NULL DEFAULT '#10b981',
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT '#1f2937',
ADD COLUMN     "warningColor" TEXT NOT NULL DEFAULT '#f59e0b';
