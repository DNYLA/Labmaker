/*
  Warnings:

  - You are about to drop the column `actionMessage` on the `UserLogs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserLogs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserLogs` table. All the data in the column will be lost.
  - Added the required column `component_name` to the `UserLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `component_type` to the `UserLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_address` to the `UserLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Id` to the `UserLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `UserLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserLogs" DROP CONSTRAINT "UserLogs_userId_fkey";

-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "actionMessage",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "component_name" TEXT NOT NULL,
ADD COLUMN     "component_type" TEXT NOT NULL,
ADD COLUMN     "information" TEXT,
ADD COLUMN     "ip_address" TEXT NOT NULL,
ADD COLUMN     "num_rows" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_Id" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL;
