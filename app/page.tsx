import { getSessionCookie } from "@/lib/cookie";
import prisma from "@/lib/prisma";
import Link from "next/link";
import LogOutButton from "./auth/LogOutButton";
import JoinGameButton from "./game/JoinGameButton";

export default async function Home() {
  const sessionId = getSessionCookie();
  const session = sessionId
    ? await prisma.session.findUnique({ where: { id: sessionId } })
    : null;
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          games: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    : null;
  const availableGames = await prisma.game.findMany({
    where: {
      participants: {
        none: {
          id: user?.id,
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
      {user?.games?.length ? (
        <>
          <h3>My Games</h3>
          <ul>
            {user.games.map((game) => (
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
                <JoinGameButton gameId={game.id} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
