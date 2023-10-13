"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function joinGame(gameId: string) {
  const user = await getSession();
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
