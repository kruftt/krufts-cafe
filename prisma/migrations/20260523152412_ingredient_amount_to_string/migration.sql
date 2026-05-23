-- AlterTable
ALTER TABLE "ingredient" ALTER COLUMN "amount" SET DEFAULT '',
ALTER COLUMN "amount" SET DATA TYPE TEXT USING amount::text;
