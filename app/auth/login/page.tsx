"use client";

import { useState } from "react";
import { logIn } from "../actions";
import Link from "next/link";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, formAction] = useFormState(logIn, null);

  return (
    <form action={formAction}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/auth/register">Register</Link>
        </li>
      </ul>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Log in</button>
      {formState && <p>{formState}</p>}
    </form>
  );
}
