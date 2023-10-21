import prisma from "@/lib/prisma";
import { ChevronLeftIcon } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BingoGrid } from "@/components/bingo-grid";
import { BingoCell } from "@/components/bingo-cell";
import ShareButton from "./share-button";

export default async function ParticipationPage({
  params,
}: {
  params: { id: string; participationId: string };
}) {
  const participation = await prisma.participation.findUnique({
    where: { id: params.participationId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
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
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href={`../leaderboard`} className={styles.back} replace>
                <ChevronLeftIcon size={32} />
                Leaderboard
              </Link>
            </li>
          </ul>
        </nav>
        <main className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionRow}>{participation.user.email}</div>
            <div className={styles.sectionRow}>
              <span>Score</span>
              <span>{game.participations[0].score}</span>
            </div>
            <ShareButton className={styles.action}>Share</ShareButton>
          </div>
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
        </main>
      </div>
    </div>
  );
}
