"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame() {
  const user = await getSession();
  if (user == null) {
    throw new Error("Unauthorized.");
  }

  let gameId: string;
  try {
    const game = await prisma.game.create({
      data: {
        name: "New Game",
        host: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    gameId = game.id;
  } catch (e) {
    throw new Error("Failed to create new game.");
  }

  revalidatePath("/");
  redirect(`/game/${gameId}`);
}

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
        participatingGames: {
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
