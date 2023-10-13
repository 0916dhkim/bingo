import prisma from "@/lib/prisma";
import Link from "next/link";
import LogOutButton from "./auth/LogOutButton";
import JoinGameButton from "./game/JoinGameButton";
import { getSession } from "@/lib/session";

export default async function Home() {
  const user = await getSession();
  const myGames = user
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
      participants: {
        every: {
          NOT: {
            id: user?.id,
          },
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
      {myGames.length ? (
        <>
          <h3>My Games</h3>
          <ul>
            {myGames.map((game) => (
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
