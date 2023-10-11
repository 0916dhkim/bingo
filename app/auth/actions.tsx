"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  destroySessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/lib/cookie";

export async function register(state: string | null, data: FormData) {
  const email = data.get("email");
  const password = data.get("password");

  if (typeof email !== "string") {
    return "Invalid input: email should be a string.";
  }
  if (typeof password !== "string") {
    return "Invalid input: password should be a string.";
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
        },
      });
      const session = await tx.session.create({
        data: {
          userId: user.id,
        },
      });
      setSessionCookie(session.id);
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return "The email already exists";
    }
    return "Failed to register.";
  }

  revalidatePath("/");
  redirect("/");
}

export async function logIn(state: string | null, data: FormData) {
  const email = data.get("email");
  const password = data.get("password");

  if (typeof email !== "string") {
    return "Invalid input: email should be a string.";
  }
  if (typeof password !== "string") {
    return "Invalid input: password should be a string.";
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user == null) {
    return "Email or password is incorrect.";
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return "Email or password is incorrect.";
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });
  setSessionCookie(session.id);
  revalidatePath("/");
  redirect("/");
}

export async function logOut() {
  const sessionId = getSessionCookie();
  if (sessionId != null) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  }
  destroySessionCookie();
  revalidatePath("/");
  redirect("/");
}
