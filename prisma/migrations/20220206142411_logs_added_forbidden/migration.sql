/*
  Warnings:

  - The values [UNAUTHORIZED] on the enum `ResponseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResponseType_new" AS ENUM ('COMPLETED', 'FORBIDDEN', 'GONE');
ALTER TABLE "UserLogs" ALTER COLUMN "response" DROP DEFAULT;
ALTER TABLE "UserLogs" ALTER COLUMN "response" TYPE "ResponseType_new" USING ("response"::text::"ResponseType_new");
ALTER TYPE "ResponseType" RENAME TO "ResponseType_old";
ALTER TYPE "ResponseType_new" RENAME TO "ResponseType";
DROP TYPE "ResponseType_old";
ALTER TABLE "UserLogs" ALTER COLUMN "response" SET DEFAULT 'COMPLETED';
COMMIT;
