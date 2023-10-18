import styles from "./bingo-grid.module.css";

type BingoGridProps = {
  cells: React.ReactNode[];
};

export function BingoGrid(props: BingoGridProps) {
  if (props.cells.length !== 25) {
    throw new Error("There should be 25 cells in a bingo board.");
  }

  return (
    <div className={styles.board}>
      {props.cells.map((cell, index) => (
        <div key={index} className={styles.cell}>
          {cell}
        </div>
      ))}
    </div>
  );
}
