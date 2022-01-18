-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'TUTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';
