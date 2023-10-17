import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LeaderboardPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      participations: {
        orderBy: [{ score: "desc" }],
        include: {
          user: { select: { email: true } },
        },
      },
    },
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
        <li>
          <Link href="./">Back to game</Link>
        </li>
      </ul>
      <h3>Leaderboard: {game.name}</h3>
      <ol>
        {game.participations.map((participation) => (
          <li key={participation.id}>
            {participation.user.email} | {participation.score} points
          </li>
        ))}
      </ol>
    </main>
  );
}
