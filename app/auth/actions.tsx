"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";

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
      await createSession(user.id, tx);
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

  await createSession(user.id, prisma);
  revalidatePath("/");
  redirect("/");
}

export async function logOut() {
  await destroySession();
  revalidatePath("/");
  redirect("/");
}
