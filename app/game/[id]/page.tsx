import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await prisma.game.findUnique({ where: { id: params.id } });
  if (game == null) {
    return notFound();
  }

  return (
    <main>
      <p>{game.id}</p>
      <p>{game.name}</p>
    </main>
  );
}
