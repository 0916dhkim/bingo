import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BingoGrid } from "@/components/bingo-grid";
import { BingoCell } from "@/components/bingo-cell";

export default async function ParticipationPage({
  params,
}: {
  params: { id: string; participationId: string };
}) {
  const participation = await prisma.participation.findUnique({
    where: { id: params.participationId },
  });
  if (participation == null) {
    return notFound();
  }
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      participations: {
        where: { gameId: params.id, userId: participation.userId },
        select: { score: true },
      },
      cells: {
        orderBy: [{ rowIndex: "asc" }, { columnIndex: "asc" }],
        include: {
          daubs: {
            where: {
              userId: participation.userId,
            },
          },
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
          <Link href={`../leaderboard`}>Leaderboard</Link>
        </li>
      </ul>
      <h1>{game.name}</h1>
      <p>Score: {game.participations[0].score}</p>
      <div className={styles.gridLayout}>
        <BingoGrid
          cells={game.cells.map((cell) => (
            <BingoCell
              key={cell.id}
              daubed={!!cell.daubs[0]}
              backgroundImageUrl={cell.daubs[0]?.imageUrl}
            >
              <span className={styles.description}>{cell.description}</span>
            </BingoCell>
          ))}
        />
      </div>
    </main>
  );
}
