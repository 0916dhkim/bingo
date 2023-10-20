import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import LogOutButton from "./auth/log-out-button";
import JoinGameButton from "./game/join-game-button";
import { getSession } from "@/lib/session";
import CreateGameButton from "./game/create-game-button";
import { Landing } from "./landing";
import { ChevronRightIcon } from "lucide-react";

export default async function Home() {
  const user = await getSession();

  if (user == null) {
    return <Landing />;
  }

  const hostingGames = await prisma.game.findMany({
    where: { hostId: user.id },
    select: {
      id: true,
      name: true,
    },
  });
  const participatingGames = await prisma.game.findMany({
    where: { participations: { some: { userId: user.id } } },
    select: {
      id: true,
      name: true,
    },
  });
  const availableGames = await prisma.game.findMany({
    where: {
      AND: {
        participations: {
          every: {
            NOT: {
              userId: user.id,
            },
          },
        },
        hostId: {
          not: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          participations: true,
        },
      },
    },
  });

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li />
            <li>Trail Bingo</li>
            <li />
          </ul>
        </nav>
        <main className={styles.content}>
          <p className={styles.sectionHeader}>Games I Made</p>
          <div className={styles.section}>
            {hostingGames.map((game) => (
              <Link
                key={game.id}
                className={styles.sectionRow}
                href={`/game/${game.id}/edit`}
              >
                {game.name} <ChevronRightIcon />
              </Link>
            ))}
            <CreateGameButton className={styles.action}>
              Create Game
            </CreateGameButton>
          </div>
          {participatingGames.length ? (
            <>
              <p className={styles.sectionHeader}>Games I Am In</p>
              <div className={styles.section}>
                {participatingGames.map((game) => (
                  <Link
                    key={game.id}
                    className={styles.sectionRow}
                    href={`/game/${game.id}`}
                  >
                    {game.name} <ChevronRightIcon />
                  </Link>
                ))}
              </div>
            </>
          ) : null}
          {availableGames.length ? (
            <>
              <p className={styles.sectionHeader}>Join a Game</p>
              <div className={styles.section}>
                {availableGames.map((game) => (
                  <JoinGameButton
                    key={game.id}
                    gameId={game.id}
                    className={styles.sectionRow}
                  >
                    {game.name} ({game._count.participations})
                    <ChevronRightIcon />
                  </JoinGameButton>
                ))}
              </div>
            </>
          ) : null}

          <p className={styles.sectionHeader}>Account</p>
          <div className={styles.section}>
            <div className={styles.sectionRow}>
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <LogOutButton className={styles.action}>Log Out</LogOutButton>
          </div>
        </main>
      </div>
    </div>
  );
}
