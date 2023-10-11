import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";

export function getSessionCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}

export function setSessionCookie(sessionId: string) {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function destroySessionCookie() {
  cookies().delete(SESSION_COOKIE_NAME);
}
