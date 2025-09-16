-- CreateTable
CREATE TABLE "message_files" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "message_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_files_messageId_fileId_key" ON "message_files"("messageId", "fileId");

-- AddForeignKey
ALTER TABLE "message_files" ADD CONSTRAINT "message_files_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_files" ADD CONSTRAINT "message_files_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
