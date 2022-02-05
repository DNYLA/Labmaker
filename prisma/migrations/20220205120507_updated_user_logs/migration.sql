/*
  Warnings:

  - You are about to drop the column `toUserId` on the `UserLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "toUserId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
