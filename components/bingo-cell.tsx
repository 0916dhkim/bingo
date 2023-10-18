import styles from "./bingo-cell.module.css";

type BingoCellProps = {
  background?: string;
  children?: React.ReactNode;
};

export function BingoCell(props: BingoCellProps) {
  const cssProperties: Record<string, unknown> = {
    "--background": props.background,
  };

  return (
    <div className={styles.container} style={cssProperties}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
