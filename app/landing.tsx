import { BingoCell } from "@/components/bingo-cell";
import { BingoGrid } from "@/components/bingo-grid";
import Link from "next/link";
import styles from "./landing.module.css";

export function Landing() {
  return (
    <main className={styles.root}>
      <BingoGrid
        cells={[
          <BingoCell key={1} daubed={false} />,
          <BingoCell key={2} daubed={false} />,
          <BingoCell key={3} daubed={false} />,
          <BingoCell key={4} daubed={false} />,
          <BingoCell key={5} daubed>
            <span className={styles.character}>📷</span>
          </BingoCell>,
          <BingoCell key={6} daubed={false}>
            <span className={styles.character}>P</span>
          </BingoCell>,
          <BingoCell key={7} daubed={false}>
            <span className={styles.character}>H</span>
          </BingoCell>,
          <BingoCell key={8} daubed={false}>
            <span className={styles.character}>O</span>
          </BingoCell>,
          <BingoCell key={9} daubed>
            <span className={styles.character}>T</span>
          </BingoCell>,
          <BingoCell key={10} daubed={false}>
            <span className={styles.character}>O</span>
          </BingoCell>,
          <BingoCell key={11} daubed={false}>
            <span className={styles.character}>B</span>
          </BingoCell>,
          <BingoCell key={12} daubed={false}>
            <span className={styles.character}>I</span>
          </BingoCell>,
          <BingoCell key={13} daubed>
            <span className={styles.character}>N</span>
          </BingoCell>,
          <BingoCell key={14} daubed={false}>
            <span className={styles.character}>G</span>
          </BingoCell>,
          <BingoCell key={15} daubed={false}>
            <span className={styles.character}>O</span>
          </BingoCell>,
          <BingoCell key={16} daubed={false} />,
          <BingoCell key={17} daubed />,
          <BingoCell key={18} daubed={false} />,
          <BingoCell key={19} daubed={false} />,
          <BingoCell key={20} daubed={false} />,
          <BingoCell key={21} daubed />,
          <BingoCell key={22} daubed={false} />,
          <BingoCell key={23} daubed={false} />,
          <BingoCell key={24} daubed={false} />,
          <BingoCell key={25} daubed={false} />,
        ]}
      />
      <div className={styles.authContainer}>
        <Link
          href="/auth/register"
          className={[styles.authLink, styles.register].join(" ")}
        >
          Register
        </Link>
        <Link href="/auth/login" className={styles.authLink}>
          Login
        </Link>
      </div>
    </main>
  );
}
