/*
  Warnings:

  - You are about to drop the column `userId` on the `api_keys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_userId_fkey";

-- DropIndex
DROP INDEX "api_keys_userId_idx";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "userId";
