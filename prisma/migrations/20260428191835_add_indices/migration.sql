/*
  Warnings:

  - Added the required column `index` to the `ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredient" ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "instruction" ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "step" ADD COLUMN     "index" INTEGER NOT NULL;
