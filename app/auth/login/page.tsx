"use client";

import { ChevronLeftIcon } from "lucide-react";
import styles from "./page.module.css";
import { useState } from "react";
import { logIn } from "../actions";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, formAction] = useFormState(logIn, null);

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
            <li>Log in</li>
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
            <button className={styles.action}>Log in</button>
          </div>
          {formState && <p>{formState}</p>}
        </form>
      </div>
    </div>
  );
}
