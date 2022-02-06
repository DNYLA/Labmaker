/*
  Warnings:

  - You are about to drop the column `action` on the `UserLogs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('GET', 'PUT', 'POST', 'DELETE');

-- AlterTable
ALTER TABLE "UserLogs" DROP COLUMN "action",
ADD COLUMN     "method" "RequestType" NOT NULL DEFAULT E'GET';

-- DropEnum
DROP TYPE "UserLogType";
