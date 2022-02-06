/*
  Warnings:

  - You are about to drop the column `accepted` on the `UserLogs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('COMPLETED', 'UNAUTHORIZED', 'GONE');

-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "accepted",
ADD COLUMN     "response" "ResponseType" NOT NULL DEFAULT E'COMPLETED';
