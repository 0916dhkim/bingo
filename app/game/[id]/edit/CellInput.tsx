import { Cell } from "@prisma/client";
import { useState } from "react";

type CellInputProps = {
  currentValue: Cell;
};
export default function CellInput(props: CellInputProps) {
  const [description, setDescription] = useState(
    props.currentValue.description,
  );
  const displayCellNumber =
    props.currentValue.rowIndex * 5 + props.currentValue.columnIndex + 1;
  return (
    <div>
      Q{displayCellNumber}
      <input
        name={`cell-description-${props.currentValue.rowIndex}-${props.currentValue.columnIndex}`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
}
