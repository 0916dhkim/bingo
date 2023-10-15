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
  redirect(`/game/${gameId}/edit`);
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

export async function editGame(state: string | null, data: FormData) {
  const user = await getSession();
  if (user == null) {
    return "Unauthorized.";
  }
  const id = data.get("id");
  const name = data.get("name");

  if (typeof id !== "string") {
    return "Invalid input: id should be a string.";
  }
  if (typeof name !== "string") {
    return "Invalid input: name should be a string.";
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id, hostId: user.id },
    });
    if (game == null) {
      return "Game does not exist or you are not authorized to edit it.";
    }
    await prisma.game.update({
      where: { id, hostId: user.id },
      data: {
        name,
      },
    });
  } catch {
    return "Failed to edit game.";
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteGame(gameId: string) {
  const user = await getSession();
  if (user == null) {
    throw new Error("Unauthorized.");
  }
  const game = await prisma.game.findUnique({
    where: { id: gameId, hostId: user.id },
  });
  if (game == null) {
    throw new Error("Unauthorized.");
  }

  try {
    await prisma.game.delete({
      where: {
        id: gameId,
      },
    });
  } catch {
    throw new Error("Failed to delete the game.");
  }

  revalidatePath("/");
  redirect("/");
}
