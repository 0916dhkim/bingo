"use client";

import { Game } from "@prisma/client";
import { startTransition, useState } from "react";
import { deleteGame, editGame } from "../../actions";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

type EditGameFormProps = {
  currentGame: Game;
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
      <h3>Name</h3>
      <input hidden readOnly name="id" value={props.currentGame.id} />
      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button>Save</button>
      <button onClick={handleDeleteGameClick}>Delete Game</button>
      {formState && <p>{formState}</p>}
    </form>
  );
}
