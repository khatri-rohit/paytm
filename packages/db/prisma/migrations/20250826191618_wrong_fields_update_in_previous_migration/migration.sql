/*
  Warnings:

  - You are about to drop the column `isNewUser` on the `Balance` table. All the data in the column will be lost.
  - Added the required column `isNewUser` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Balance" DROP COLUMN "isNewUser";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isNewUser" BOOLEAN NOT NULL;
