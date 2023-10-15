"use client";

import { startTransition } from "react";
import { createGame } from "./actions";

export default function CreateGameButton() {
  const handleClick = () => {
    startTransition(() => {
      createGame().catch((e) => alert(e));
    });
  };
  return <button onClick={handleClick}>Create new game</button>;
}
