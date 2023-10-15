import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import EditGameForm from "./EditGameForm";
import Link from "next/link";

export default async function EditGamePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getSession();
  if (user == null) {
    return notFound();
  }
  const game = await prisma.game.findUnique({
    where: { id: params.id, hostId: user.id },
  });
  if (game == null) {
    return notFound();
  }

  return (
    <main>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
      <EditGameForm currentGame={game} />
    </main>
  );
}
