/*
  Warnings:

  - The values [uni] on the enum `Education` will be removed. If these variants are still used in the database, this will fail.
  - The values [chem] on the enum `Subjects` will be removed. If these variants are still used in the database, this will fail.
  - The values [hw] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Education_new" AS ENUM ('university', 'college', 'other');
ALTER TABLE "Ticket" ALTER COLUMN "education" TYPE "Education_new" USING ("education"::text::"Education_new");
ALTER TYPE "Education" RENAME TO "Education_old";
ALTER TYPE "Education_new" RENAME TO "Education";
DROP TYPE "Education_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Subjects_new" AS ENUM ('maths', 'compSci', 'english', 'chemistry', 'physics', 'bio', 'other');
ALTER TABLE "User" ALTER COLUMN "verifiedSubjects" TYPE "Subjects_new"[] USING ("verifiedSubjects"::text::"Subjects_new"[]);
ALTER TABLE "Ticket" ALTER COLUMN "subject" TYPE "Subjects_new" USING ("subject"::text::"Subjects_new");
ALTER TYPE "Subjects" RENAME TO "Subjects_old";
ALTER TYPE "Subjects_new" RENAME TO "Subjects";
DROP TYPE "Subjects_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('homework', 'exam', 'assignment', 'other');
ALTER TABLE "Ticket" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;
