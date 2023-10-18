import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { BingoGrid } from "@/components/bingo-grid";
import { BingoCell } from "@/components/bingo-cell";

export default async function GamePage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (user == null) {
    return notFound();
  }

  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      participations: {
        where: { gameId: params.id, userId: user.id },
        select: { score: true },
      },
      cells: {
        orderBy: [{ rowIndex: "asc" }, { columnIndex: "asc" }],
        include: {
          daubs: {
            where: {
              userId: user.id,
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
          <Link href={`${game.id}/leaderboard`}>Leaderboard</Link>
        </li>
      </ul>
      <h1>{game.name}</h1>
      <p>Your score: {game.participations[0].score}</p>
      <div className={styles.gridLayout}>
        <BingoGrid
          cells={game.cells.map((cell) => (
            <BingoCell
              key={cell.id}
              background={
                cell.daubs[0]
                  ? cell.daubs[0].imageUrl
                    ? `url(${cell.daubs[0].imageUrl}) grey`
                    : "gold"
                  : undefined
              }
            >
              <Link
                href={`${params.id}/cell/${cell.id}`}
                className={styles.cell}
              >
                {cell.description}
              </Link>
            </BingoCell>
          ))}
        />
      </div>
    </main>
  );
}
