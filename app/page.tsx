import { getSessionCookie } from "@/lib/cookie";
import prisma from "@/lib/prisma";
import Link from "next/link";
import LogOutButton from "./auth/LogOutButton";

export default async function Home() {
  const sessionId = getSessionCookie();
  const session = sessionId
    ? await prisma.session.findUnique({ where: { id: sessionId } })
    : null;
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.userId } })
    : null;
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
    </main>
  );
}
