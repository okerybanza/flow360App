-- CreateTable
CREATE TABLE "file_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "file_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_comments" ADD CONSTRAINT "file_comments_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_comments" ADD CONSTRAINT "file_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_comments" ADD CONSTRAINT "file_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "file_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
