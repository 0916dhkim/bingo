"use server";

import prisma from "@/lib/prisma";
import { boardStatus, calculateScore } from "@/lib/score";
import { getSession } from "@/lib/session";
import { uploadImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

type DaubCellInput = {
  cellId: string;
  image: Blob | null;
};
function validateDaubCellInput(
  data: FormData,
): { success: false; error: string } | { success: true; value: DaubCellInput } {
  const cellId = data.get("cellId");
  const image = data.get("image");
  if (typeof cellId !== "string") {
    return {
      success: false,
      error: "Invalid input: cellId should be a string.",
    };
  }
  if (!(image instanceof Blob)) {
    return { success: false, error: "Invalid input: image should be a file." };
  }

  return { success: true, value: { cellId, image: image.size ? image : null } };
}

export async function daubCell(state: string | null, data: FormData) {
  const user = await getSession();
  if (user == null) {
    return "Unauthorized.";
  }
  const validation = validateDaubCellInput(data);
  if (!validation.success) {
    return validation.error;
  }
  const { cellId, image } = validation.value;
  let imageUrl: string | undefined;
  if (image) {
    try {
      imageUrl = await uploadImage(image);
    } catch {
      return "Failed to upload the image.";
    }
  }
  try {
    await prisma.$transaction(async (tx) => {
      await tx.daub.upsert({
        where: { userId_cellId: { userId: user.id, cellId } },
        create: {
          imageUrl,
          cell: {
            connect: {
              id: cellId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        update: {
          imageUrl,
        },
      });
      const cellAfterUpsert = await tx.cell.findUnique({
        where: { id: cellId },
        select: {
          game: {
            select: {
              id: true,
              cells: {
                select: {
                  rowIndex: true,
                  columnIndex: true,
                  daubs: {
                    where: { userId: user.id },
                  },
                },
              },
            },
          },
        },
      });
      if (cellAfterUpsert == null) {
        throw new Error(
          "Cell should never be null if the upsert was successful.",
        );
      }
      const score = calculateScore(boardStatus(cellAfterUpsert.game.cells));
      await tx.participation.update({
        where: {
          userId_gameId: {
            userId: user.id,
            gameId: cellAfterUpsert.game.id,
          },
        },
        data: { score },
      });
    });
  } catch {
    return "Failed to daub the cell.";
  }

  revalidatePath("/game");
  redirect("..", RedirectType.replace);
}
