import { cookies } from "next/headers";
import prisma, { Transaction } from "./prisma";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getSessionCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

export async function getSession() {
  const sessionId = getSessionCookie();
  if (sessionId == null) {
    return null;
  }
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session == null) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  return user;
}

export async function createSession(userId: string, tx: Transaction) {
  const session = await tx.session.create({
    data: {
      userId: userId,
    },
  });
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: session.id,
    maxAge: SESSION_MAX_AGE_SEC,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const sessionId = getSessionCookie();
  if (sessionId != null) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }
  cookies().delete(SESSION_COOKIE_NAME);
}
