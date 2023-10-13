import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export type Transaction = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];
export default prisma;
