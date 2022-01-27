/*
  Warnings:

  - The `type` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subject` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Subjects" AS ENUM ('maths', 'compSci', 'english', 'chem', 'physics', 'bio', 'other');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('homework', 'exam', 'other');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('uni', 'college', 'other');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "type",
ADD COLUMN     "type" "Type",
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subjects",
DROP COLUMN "education",
ADD COLUMN     "education" "Education";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifiedSubjects" "Subjects"[];
