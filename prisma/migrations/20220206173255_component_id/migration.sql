/*
  Warnings:

  - You are about to drop the column `component_ids` on the `UserLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "component_ids",
ADD COLUMN     "component_id" TEXT;
