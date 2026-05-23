-- AlterTable
ALTER TABLE "recipe" ALTER COLUMN "serves" SET DEFAULT '4',
ALTER COLUMN "serves" SET DATA TYPE TEXT USING serves::text;
