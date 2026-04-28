/*
  Warnings:

  - Added the required column `stepId` to the `ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredient" ADD COLUMN     "stepId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
