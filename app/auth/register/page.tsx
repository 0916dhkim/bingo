"use client";

import { ChevronLeftIcon } from "lucide-react";
import styles from "./page.module.css";
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
    <div className={styles.root}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/" className={styles.back} replace>
                <ChevronLeftIcon size={32} />
                Back
              </Link>
            </li>
            <li>Register</li>
          </ul>
        </nav>
        <form action={formAction} className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionRow}>
              Email
              <input
                name="email"
                type="email"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.sectionRow}>
              Password
              <input
                name="password"
                type="password"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <button className={styles.action}>Register</button>
          </div>
          {formState && <p>{formState}</p>}
        </form>
      </div>
    </div>
  );
}
