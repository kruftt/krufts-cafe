-- CreateTable
CREATE TABLE "pin" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pin_userId_recipeId_key" ON "pin"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_userId_recipeId_key" ON "bookmark"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "pin" ADD CONSTRAINT "pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pin" ADD CONSTRAINT "pin_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
