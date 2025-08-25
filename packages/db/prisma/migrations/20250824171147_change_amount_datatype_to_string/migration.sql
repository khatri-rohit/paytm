-- AlterTable
ALTER TABLE "public"."Balance" ALTER COLUMN "currency" SET DEFAULT 'INR',
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."OnRampTransaction" ALTER COLUMN "processing" DROP DEFAULT,
ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."P2PTransfer" ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."TransactionHistory" ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "balanceBefore" SET DATA TYPE TEXT,
ALTER COLUMN "balanceAfter" SET DATA TYPE TEXT;
