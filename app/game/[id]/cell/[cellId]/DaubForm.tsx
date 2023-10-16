"use client";

import Link from "next/link";
import { daubCell } from "./actions";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

type DaubFormProps = {
  cellId: string;
  description: string;
};

export function DaubForm(props: DaubFormProps) {
  const [formState, formAction] = useFormState(daubCell, null);

  return (
    <main>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="..">Board</Link>
        </li>
      </ul>
      <form action={formAction}>
        <p>{props.description}</p>
        <h3>(Optional) upload your image</h3>
        <input name="image" type="file" accept="image/*" />
        <input name="cellId" hidden readOnly value={props.cellId} />
        <button>Submit</button>
        {formState && <p>{formState}</p>}
      </form>
    </main>
  );
}
