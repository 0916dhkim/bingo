/*
  Warnings:

  - You are about to drop the column `type` on the `Cell` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "type";

-- DropEnum
DROP TYPE "CellType";
