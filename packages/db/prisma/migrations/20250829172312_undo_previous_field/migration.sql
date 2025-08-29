/*
  Warnings:

  - You are about to drop the column `transactionType` on the `P2PTransfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."P2PTransfer" DROP COLUMN "transactionType";
