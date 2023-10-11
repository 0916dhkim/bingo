import { getSessionCookie } from "@/lib/cookie";
import styles from "./page.module.css";
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
      hi {user ? user.email : null}
      {user ? (
        <LogOutButton />
      ) : (
        <>
          <Link href="/auth/register">Register</Link>
          <Link href="/auth/login">Login</Link>
        </>
      )}
    </main>
  );
}
