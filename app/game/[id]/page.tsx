import prisma from "@/lib/prisma";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/" className={styles.back} replace>
                <ChevronLeftIcon size={32} />
                Home
              </Link>
            </li>
            <li>{game.name}</li>
          </ul>
        </nav>
        <main className={styles.content}>
          <BingoGrid
            cells={game.cells.map((cell) => (
              <BingoCell
                key={cell.id}
                daubed={!!cell.daubs[0]}
                backgroundImageUrl={cell.daubs[0]?.imageUrl}
              >
                <Link
                  href={`${params.id}/cell/${cell.id}`}
                  className={styles.cell}
                >
                  <span className={styles.description}>{cell.description}</span>
                </Link>
              </BingoCell>
            ))}
          />
          <div className={styles.section}>
            <div className={styles.sectionRow}>
              <span>Score</span>
              <span>{game.participations[0].score}</span>
            </div>
            <Link href={`${game.id}/leaderboard`} className={styles.sectionRow}>
              Leaderboard <ChevronRightIcon />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
