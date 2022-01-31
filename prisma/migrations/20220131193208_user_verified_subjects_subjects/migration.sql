/*
  Warnings:

  - You are about to drop the column `verifiedSubjects` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifiedSubjects",
ADD COLUMN     "subjects" "Subjects"[];
