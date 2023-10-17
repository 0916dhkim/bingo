export const CellStatus = {
  daubedWithImage: "DAUBED_WITH_IMAGE",
  daubedWithoutImage: "DAUBED_WITHOUT_IMAGE",
  notDaubed: "NOT_DAUBED",
} as const;
export type CellStatus = (typeof CellStatus)[keyof typeof CellStatus];

export function calculateScore(boardStatus: CellStatus[]): number {
  let score = 0;
  // Check bingos.
  // Rows.
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    let isBingo = true;
    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
      if (boardStatus[rowIndex * 5 + columnIndex] === CellStatus.notDaubed) {
        isBingo = false;
        break;
      }
    }
    if (isBingo) {
      score += 5;
    }
  }
  // Columns.
  for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
    let isBingo = true;
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      if (boardStatus[rowIndex * 5 + columnIndex] === CellStatus.notDaubed) {
        isBingo = false;
        break;
      }
    }
    if (isBingo) {
      score += 5;
    }
  }
  // Diagonal (\)
  {
    let isBingo = true;
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      if (boardStatus[rowIndex * 6] === CellStatus.notDaubed) {
        isBingo = false;
        break;
      }
    }
    if (isBingo) {
      score += 5;
    }
  }
  // Diagonal (/)
  {
    let isBingo = true;
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      if (boardStatus[(rowIndex + 1) * 4] === CellStatus.notDaubed) {
        isBingo = false;
        break;
      }
    }
    if (isBingo) {
      score += 5;
    }
  }

  // Add bonus points.
  for (const status of boardStatus) {
    if (status === "DAUBED_WITHOUT_IMAGE") {
      score += 1;
    }
    if (status === "DAUBED_WITH_IMAGE") {
      score += 3;
    }
  }

  return score;
}

export function boardStatus(
  cells: {
    rowIndex: number;
    columnIndex: number;
    daubs: { imageUrl?: string | null }[];
  }[],
): CellStatus[] {
  const board: CellStatus[] = Array(25)
    .fill(null)
    .map(() => CellStatus.notDaubed);
  for (const cell of cells) {
    let cellStatus: CellStatus = CellStatus.notDaubed;
    if (cell.daubs.length > 0) {
      if (cell.daubs[0].imageUrl == null) {
        cellStatus = CellStatus.daubedWithoutImage;
      } else {
        cellStatus = CellStatus.daubedWithImage;
      }
    }
    board[cell.rowIndex * 5 + cell.columnIndex] = cellStatus;
  }
  return board;
}
