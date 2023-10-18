import Link from "next/link";

export function Landing() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/auth/register">Register</Link>
        </li>
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
      </ul>
    </main>
  );
}
