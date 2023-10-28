"use client";

import { Cell, Game } from "@prisma/client";
import { startTransition, useState } from "react";
import { deleteGame, editGame } from "../../actions";
import CellInput from "./CellInput";
import { useFormState } from "react-dom";

type EditGameFormProps = {
  currentGame: Game & { cells: Cell[] };
};

export default function EditGameForm(props: EditGameFormProps) {
  const [formState, formAction] = useFormState(editGame, null);
  const [name, setName] = useState(props.currentGame.name);

  const handleDeleteGameClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    if (confirm("Do you really want to delete this game?")) {
      startTransition(() => {
        deleteGame(props.currentGame.id).catch((e) => alert(e));
      });
    }
  };

  return (
    <form action={formAction}>
      <input hidden readOnly name="id" value={props.currentGame.id} />
      <h3>Name</h3>
      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h3>Cells</h3>
      {props.currentGame.cells.map((cell) => (
        <CellInput key={cell.id} currentValue={cell} />
      ))}
      <button>Save</button>
      <button onClick={handleDeleteGameClick}>Delete Game</button>
      {formState && <p>{formState}</p>}
    </form>
  );
}
