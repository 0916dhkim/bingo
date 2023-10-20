"use client";

import { startTransition } from "react";
import { createGame } from "./actions";

type CreateGameButtonProps = {
  className: string;
  children?: React.ReactNode;
};

export default function CreateGameButton(props: CreateGameButtonProps) {
  const handleClick = () => {
    startTransition(() => {
      createGame().catch((e) => alert(e));
    });
  };

  return (
    <button onClick={handleClick} className={props.className}>
      {props.children}
    </button>
  );
}
