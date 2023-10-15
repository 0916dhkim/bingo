-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Daub" DROP CONSTRAINT "Daub_cellId_fkey";

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daub" ADD CONSTRAINT "Daub_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell"("id") ON DELETE CASCADE ON UPDATE CASCADE;
