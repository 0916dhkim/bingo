/*
  Warnings:

  - A unique constraint covering the columns `[gameId,rowIndex,columnIndex]` on the table `Cell` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cell_gameId_rowIndex_columnIndex_key" ON "Cell"("gameId", "rowIndex", "columnIndex");
