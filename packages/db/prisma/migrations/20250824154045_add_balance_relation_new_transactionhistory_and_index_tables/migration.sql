/*
  Warnings:

  - The `amount` column on the `Balance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `proccesing` on the `OnRampTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bankId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `amount` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ON_RAMP');

-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Balance" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(15,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "public"."OnRampTransaction" DROP COLUMN "proccesing",
ADD COLUMN     "processing" "public"."Status" NOT NULL DEFAULT 'PROCESSING',
DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(15,2) NOT NULL;

-- AlterTable
ALTER TABLE "public"."P2PTransfer" ADD COLUMN     "status" "public"."TransferStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(15,2),
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bankId" INTEGER;

-- CreateTable
CREATE TABLE "public"."TransactionHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "transactionType" "public"."TransactionType" NOT NULL,
    "description" TEXT,
    "balanceBefore" DECIMAL(15,2) NOT NULL,
    "balanceAfter" DECIMAL(15,2) NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransactionHistory_userId_idx" ON "public"."TransactionHistory"("userId");

-- CreateIndex
CREATE INDEX "TransactionHistory_createdAt_idx" ON "public"."TransactionHistory"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionHistory_referenceId_idx" ON "public"."TransactionHistory"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "public"."Balance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_token_key" ON "public"."OnRampTransaction"("token");

-- CreateIndex
CREATE INDEX "OnRampTransaction_userId_idx" ON "public"."OnRampTransaction"("userId");

-- CreateIndex
CREATE INDEX "OnRampTransaction_createdAt_idx" ON "public"."OnRampTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "P2PTransfer_fromUserId_idx" ON "public"."P2PTransfer"("fromUserId");

-- CreateIndex
CREATE INDEX "P2PTransfer_toUserId_idx" ON "public"."P2PTransfer"("toUserId");

-- CreateIndex
CREATE INDEX "P2PTransfer_timestamp_idx" ON "public"."P2PTransfer"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_bankId_key" ON "public"."User"("bankId");

-- AddForeignKey
ALTER TABLE "public"."Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransactionHistory" ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
