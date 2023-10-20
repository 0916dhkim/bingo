"use client";

import { startTransition } from "react";
import { logOut } from "./actions";

type LogOutButtonProps = {
  className: string;
  children?: React.ReactNode;
};

export default function LogOutButton(props: LogOutButtonProps) {
  return (
    <button
      onClick={() =>
        startTransition(() => {
          logOut();
        })
      }
      className={props.className}
    >
      {props.children}
    </button>
  );
}
