"use client";

import { useState } from "react";
import { register } from "../actions";
import Link from "next/link";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, formAction] = useFormState(register, null);

  return (
    <form action={formAction}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
      </ul>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
      {formState && <p>{formState}</p>}
    </form>
  );
}
