/*
  Warnings:

  - Added the required column `receiverName` to the `P2PTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `P2PTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."P2PTransfer" ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;
