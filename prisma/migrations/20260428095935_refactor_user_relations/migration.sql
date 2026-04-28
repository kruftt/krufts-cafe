/*
  Warnings:

  - You are about to drop the column `authorId` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `step` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ingredient" DROP CONSTRAINT "ingredient_stepId_fkey";

-- DropForeignKey
ALTER TABLE "instruction" DROP CONSTRAINT "instruction_stepId_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_authorId_fkey";

-- DropForeignKey
ALTER TABLE "step" DROP CONSTRAINT "step_recipeId_fkey";

-- AlterTable
ALTER TABLE "ingredient" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "instruction" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "step" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step" ADD CONSTRAINT "step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction" ADD CONSTRAINT "instruction_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
