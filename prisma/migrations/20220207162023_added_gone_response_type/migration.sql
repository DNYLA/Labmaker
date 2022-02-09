-- AlterEnum
ALTER TYPE "ResponseType" ADD VALUE 'UNAVAILBLE';

-- AlterTable
ALTER TABLE "UserLogs" ALTER COLUMN "method" DROP DEFAULT;
