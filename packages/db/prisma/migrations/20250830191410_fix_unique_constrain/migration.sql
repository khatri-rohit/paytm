/*
  Warnings:

  - Made the column `entryType` on table `TransactionHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."OnRampTransaction_userId_key";

-- AlterTable
ALTER TABLE "public"."TransactionHistory" ALTER COLUMN "entryType" SET NOT NULL;
