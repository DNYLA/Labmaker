/*
  Warnings:

  - You are about to drop the column `autoReact` on the `DiscordConfig` table. All the data in the column will be lost.
  - You are about to drop the column `autoSwicher` on the `DiscordConfig` table. All the data in the column will be lost.
  - You are about to drop the column `autoTicket` on the `DiscordConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscordConfig" DROP COLUMN "autoReact",
DROP COLUMN "autoSwicher",
DROP COLUMN "autoTicket";
