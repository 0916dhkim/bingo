import prisma from "@/lib/prisma";
import Link from "next/link";
import LogOutButton from "./auth/LogOutButton";
import JoinGameButton from "./game/JoinGameButton";
import { getSession } from "@/lib/session";
import CreateGameButton from "./game/CreateGameButton";

export default async function Home() {
  const user = await getSession();
  const hostingGames = user
    ? await prisma.game.findMany({
        where: { hostId: user.id },
        select: {
          id: true,
          name: true,
        },
      })
    : [];
  const participatingGames = user
    ? await prisma.game.findMany({
        where: { participants: { some: { id: user.id } } },
        select: {
          id: true,
          name: true,
        },
      })
    : [];
  const availableGames = await prisma.game.findMany({
    where: {
      AND: {
        participants: {
          every: {
            NOT: {
              id: user?.id,
            },
          },
        },
        hostId: {
          not: user?.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });

  return (
    <main>
      <ul>
        {user ? (
          <>
            <li>hi {user ? user.email : null}</li>
            <li>
              <LogOutButton />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/auth/register">Register</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
          </>
        )}
      </ul>
      <h3>Hosting</h3>
      <ul>
        <li>
          <CreateGameButton />
        </li>
        {hostingGames.map((game) => (
          <li key={game.id}>
            <Link href={`/game/${game.id}`}>{game.name}</Link>
          </li>
        ))}
      </ul>
      {participatingGames.length ? (
        <>
          <h3>Participating Games</h3>
          <ul>
            {participatingGames.map((game) => (
              <li key={game.id}>
                <Link href={`/game/${game.id}`}>{game.name}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {availableGames.length ? (
        <>
          <h3>Available Games</h3>
          <ul>
            {availableGames.map((game) => (
              <li key={game.id}>
                {game.name} ({game._count.participants})
                {user && <JoinGameButton gameId={game.id} />}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
