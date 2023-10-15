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
        cells: {
          createMany: {
            data: Array(25)
              .fill(0)
              .map((_, index) => ({
                rowIndex: Math.floor(index / 5),
                columnIndex: index % 5,
                description: "-",
              })),
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

type EditGameInput = {
  id: string;
  name: string;
  cells: {
    rowIndex: number;
    columnIndex: number;
    description: string;
  }[];
};

function validateEditGameInput(
  data: FormData,
): { success: false; error: string } | { success: true; value: EditGameInput } {
  const id = data.get("id");
  const name = data.get("name");

  if (typeof id !== "string") {
    return { success: false, error: "Invalid input: id should be a string." };
  }
  if (typeof name !== "string") {
    return { success: false, error: "Invalid input: name should be a string." };
  }

  const cells: EditGameInput["cells"] = [];
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
      const description = data.get(
        `cell-description-${rowIndex}-${columnIndex}`,
      );
      if (typeof description !== "string") {
        return {
          success: false,
          error: `Invalid input: description of cell ${rowIndex}, ${columnIndex} should be a string.`,
        };
      }
      cells.push({ rowIndex, columnIndex, description });
    }
  }

  return { success: true, value: { id, name, cells } };
}

export async function editGame(state: string | null, data: FormData) {
  const user = await getSession();
  if (user == null) {
    return "Unauthorized.";
  }
  const validation = validateEditGameInput(data);
  if (!validation.success) {
    return validation.error;
  }
  const { id, name, cells } = validation.value;

  try {
    const game = await prisma.game.findUnique({
      where: { id, hostId: user.id },
    });
    if (game == null) {
      return "Game does not exist or you are not authorized to edit it.";
    }
    await prisma.$transaction(async (tx) => {
      await tx.game.update({
        where: { id, hostId: user.id },
        data: {
          name,
        },
      });
      for (const cell of cells) {
        await tx.cell.update({
          where: {
            gameId_rowIndex_columnIndex: {
              gameId: id,
              rowIndex: cell.rowIndex,
              columnIndex: cell.columnIndex,
            },
          },
          data: {
            description: cell.description,
          },
        });
      }
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
