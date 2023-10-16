import { getSession } from "@/lib/session";
import { DaubForm } from "./DaubForm";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CellPage({
  params,
}: {
  params: { id: string; cellId: string };
}) {
  const user = await getSession();
  if (user == null) {
    return notFound();
  }
  const cell = await prisma.cell.findUnique({ where: { id: params.cellId } });
  if (cell == null) {
    return notFound();
  }
  return <DaubForm cellId={params.cellId} description={cell.description} />;
}
