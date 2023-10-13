/*
  Warnings:

  - A unique constraint covering the columns `[userId,cellId]` on the table `Daub` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Daub_userId_cellId_key" ON "Daub"("userId", "cellId");
