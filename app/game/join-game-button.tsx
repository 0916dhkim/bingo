"use client";

import { startTransition } from "react";
import { joinGame } from "./actions";

type JoinGameButtonProps = {
  gameId: string;
  className: string;
  children?: React.ReactNode;
};

export default function JoinGameButton(props: JoinGameButtonProps) {
  const handleClick = () =>
    startTransition(() => {
      joinGame(props.gameId).catch((e) => alert(e));
    });

  return (
    <button onClick={handleClick} className={props.className}>
      {props.children}
    </button>
  );
}
