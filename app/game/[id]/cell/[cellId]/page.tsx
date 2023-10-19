import { getSession } from "@/lib/session";
import styles from "./page.module.css";
import { DaubForm } from "./daub-form";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export default async function CellPage({
  params,
}: {
  params: { id: string; cellId: string };
}) {
  const user = await getSession();
  if (user == null) {
    return notFound();
  }
  const cell = await prisma.cell.findUnique({ where: { id: params.cellId } });
  if (cell == null) {
    return notFound();
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href=".." className={styles.back} replace>
                <ChevronLeftIcon size={32} />
                Board
              </Link>
            </li>
            <li>Submit</li>
          </ul>
        </nav>
        <main className={styles.content}>
          <DaubForm cellId={params.cellId} description={cell.description} />
        </main>
      </div>
    </div>
  );
}
