import styles from "./bingo-cell.module.css";

type BingoCellProps = {
  daubed: boolean;
  backgroundImageUrl?: string | null;
  children?: React.ReactNode;
};

export function BingoCell(props: BingoCellProps) {
  const cssProperties: Record<string, unknown> = {
    "--background": props.backgroundImageUrl
      ? `url(${props.backgroundImageUrl}) grey`
      : props.daubed
      ? "oklch(53.83% 0.262 261.16)"
      : undefined,
    "--text-color": props.daubed ? "white" : "black",
  };

  return (
    <div className={styles.container} style={cssProperties}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
