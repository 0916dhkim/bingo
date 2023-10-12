"use server";

import { getSessionCookie } from "@/lib/cookie";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function joinGame(gameId: string) {
  const sessionId = getSessionCookie();
  if (sessionId == null) {
    throw new Error("Unauthorized.");
  }
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session == null) {
    throw new Error("Unauthorized.");
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (user == null) {
    throw new Error("Unauthorized.");
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        games: {
          connect: {
            id: gameId,
          },
        },
      },
    });
  } catch {
    throw new Error("Failed to join the game.");
  }

  revalidatePath("/");
  redirect(`/game/${gameId}`);
}
