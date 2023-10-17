export const CellStatus = {
  daubedWithImage: "DAUBED_WITH_IMAGE",
  daubedWithoutImage: "DAUBED_WITHOUT_IMAGE",
  notDaubed: "NOT_DAUBED",
} as const;
export type CellStatus = (typeof CellStatus)[keyof typeof CellStatus];

export function calculateScore(board: CellStatus[]): number {
  let score = 0;
  // Check bingos.
  // Rows.
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    let isBingo = true;
    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
      if (board[rowIndex * 5 + columnIndex] === CellStatus.notDaubed) {
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
      if (board[rowIndex * 5 + columnIndex] === CellStatus.notDaubed) {
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
      if (board[rowIndex * 6] === CellStatus.notDaubed) {
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
      if (board[(rowIndex + 1) * 4] === CellStatus.notDaubed) {
        isBingo = false;
        break;
      }
    }
    if (isBingo) {
      score += 5;
    }
  }

  // Add bonus points.
  for (const status of board) {
    if (status === "DAUBED_WITHOUT_IMAGE") {
      score += 1;
    }
    if (status === "DAUBED_WITH_IMAGE") {
      score += 3;
    }
  }

  return score;
}
