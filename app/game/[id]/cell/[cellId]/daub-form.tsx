"use client";

import { daubCell } from "./actions";
import styles from "./daub-form.module.css";
import { CameraIcon } from "lucide-react";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

type DaubFormProps = {
  cellId: string;
  description: string;
};

export function DaubForm(props: DaubFormProps) {
  const [formState, formAction] = useFormState(daubCell, null);

  return (
    <form action={formAction} className={styles.form}>
      <div />
      <label htmlFor="image" className={styles.fileCustom}>
        <div />
        <CameraIcon size={81} strokeWidth={1} />
        <p className={styles.fileCustomLabel}>(Optional) upload your image</p>
      </label>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        className={styles.fileHidden}
      />
      <div className={styles.lowerGroup}>
        <input name="cellId" hidden readOnly value={props.cellId} />
        <p className={styles.description}>{props.description}</p>
        {formState && <p>{formState}</p>}
        <button className={styles.submit}>I Found This!</button>
      </div>
    </form>
  );
}
