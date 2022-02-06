/*
  Warnings:

  - Added the required column `path` to the `UserLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserLogs" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "referer" TEXT,
ALTER COLUMN "user_Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserLogs" ADD CONSTRAINT "UserLogs_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
