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
        orderBy: [{ rowIndex: "asc" }, { columnIndex: "asc" }],
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
          {game.cells.map((cell) => (
            <div key={cell.id} className={styles.cell}>
              <Link href={`${params.id}/cell/${cell.id}`}>
                <span className={styles.description}>{cell.description}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
