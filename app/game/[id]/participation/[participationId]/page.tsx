import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

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
        <div className={styles.board}>
          {game.cells.map((cell) => (
            <div
              key={cell.id}
              className={styles.cell}
              style={
                {
                  "--background": cell.daubs[0]
                    ? cell.daubs[0].imageUrl
                      ? `url(${cell.daubs[0].imageUrl}) grey`
                      : "gold"
                    : undefined,
                } as Record<string, unknown>
              }
            >
              <span className={styles.description}>{cell.description}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
