"use client";

import { startTransition } from "react";
import { joinGame } from "./actions";

type JoinGameButtonProps = {
  gameId: string;
};

export default function JoinGameButton(props: JoinGameButtonProps) {
  return (
    <button
      onClick={() =>
        startTransition(() => {
          joinGame(props.gameId);
        })
      }
    >
      Join
    </button>
  );
}
