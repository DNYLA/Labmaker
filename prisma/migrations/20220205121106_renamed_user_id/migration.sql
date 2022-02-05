/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `UserLogs` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserLogs" DROP CONSTRAINT "UserLogs_fromUserId_fkey";

-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "fromUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserLogs" ADD CONSTRAINT "UserLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
