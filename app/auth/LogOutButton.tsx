"use client";

import { startTransition } from "react";
import { logOut } from "./actions";

export default function LogOutButton() {
  return (
    <button
      onClick={() =>
        startTransition(() => {
          logOut();
        })
      }
    >
      Log out
    </button>
  );
}
