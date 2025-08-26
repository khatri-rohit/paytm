/*
  Warnings:

  - Added the required column `isNewUser` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Balance" ADD COLUMN     "isNewUser" BOOLEAN NOT NULL;
