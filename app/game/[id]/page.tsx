import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getSessionCookie } from "@/lib/cookie";

export default async function GamePage({ params }: { params: { id: string } }) {
  const sessionId = getSessionCookie();
  if (sessionId == null) {
    return notFound();
  }
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (session == null) {
    return notFound();
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (user == null) {
    return notFound();
  }

  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      cells: {
        include: {
          daubs: {
            where: {
              userId: user.id,
            },
          },
        },
      },
    },
  });
  if (game == null) {
    return notFound();
  }

  const cells: ((typeof game.cells)[number] | null)[] = Array(25).fill(null);
  for (const cell of game.cells) {
    cells[5 * cell.rowIndex + cell.columnIndex] = cell;
  }

  return (
    <main>
      <h1>{game.name}</h1>
      <div className={styles.gridLayout}>
        <div className={styles.board}>
          {cells.map((cell, index) =>
            cell ? (
              <div key={cell.id} className={styles.cell}>
                <span className={styles.description}>{cell.description}</span>
              </div>
            ) : (
              <div key={index} className={styles.cell} />
            )
          )}
        </div>
      </div>
    </main>
  );
}
