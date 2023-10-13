import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function GamePage({ params }: { params: { id: string } }) {
  const user = await getSession();
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
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
      </ul>
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
