/*
  Warnings:

  - The values [CREDIT,DEBIT] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."EntryType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TransactionType_new" AS ENUM ('TRANSFER_IN', 'TRANSFER_OUT', 'ON_RAMP', 'P2P_TRANSFER');
ALTER TABLE "public"."TransactionHistory" ALTER COLUMN "transactionType" TYPE "public"."TransactionType_new" USING ("transactionType"::text::"public"."TransactionType_new");
ALTER TYPE "public"."TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "public"."TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."TransactionHistory" ADD COLUMN     "entryType" "public"."EntryType";

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_userId_key" ON "public"."OnRampTransaction"("userId");
