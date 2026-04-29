/*
  Warnings:

  - You are about to drop the column `stepId` on the `ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `stepId` on the `instruction` table. All the data in the column will be lost.
  - You are about to drop the `step` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sectionId` to the `ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `instruction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ingredient" DROP CONSTRAINT "ingredient_stepId_fkey";

-- DropForeignKey
ALTER TABLE "instruction" DROP CONSTRAINT "instruction_stepId_fkey";

-- DropForeignKey
ALTER TABLE "step" DROP CONSTRAINT "step_recipeId_fkey";

-- AlterTable
ALTER TABLE "ingredient" DROP COLUMN "stepId",
ADD COLUMN     "sectionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "instruction" DROP COLUMN "stepId",
ADD COLUMN     "sectionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "step";

-- CreateTable
CREATE TABLE "section" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction" ADD CONSTRAINT "instruction_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
