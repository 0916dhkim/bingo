import prisma from "@/lib/prisma";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

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
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="./" className={styles.back} replace>
                <ChevronLeftIcon />
                Game
              </Link>
            </li>
            <li>{game.name}</li>
          </ul>
        </nav>
        <main className={styles.content}>
          <p className={styles.sectionHeader}>Leaderboard</p>
          <div className={styles.section}>
            {game.participations.map((participation) => (
              <Link
                key={participation.id}
                href={`./participation/${participation.id}`}
                className={styles.sectionRow}
              >
                {participation.user.email} | {participation.score} points
                <ChevronRightIcon />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
