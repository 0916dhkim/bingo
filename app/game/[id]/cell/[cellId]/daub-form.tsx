"use client";

import { useEffect, useState } from "react";
import { daubCell } from "./actions";
import styles from "./daub-form.module.css";
import { CameraIcon } from "lucide-react";
import { useFormState } from "react-dom";

type DaubFormProps = {
  cellId: string;
  description: string;
};

export function DaubForm(props: DaubFormProps) {
  const [formState, formAction] = useFormState(daubCell, null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setImageFile(e.target.files?.[0] ?? null);
  };

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        if (typeof e.target?.result === "string") {
          setImagePreviewUrl(e.target.result);
        }
      });
      reader.readAsDataURL(imageFile);
      return () => reader.abort();
    }
  }, [imageFile]);

  return (
    <form action={formAction} className={styles.form}>
      <div />
      {imagePreviewUrl ? (
        <label htmlFor="image" className={styles.imagePreviewContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreviewUrl} alt="" className={styles.imagePreview} />
        </label>
      ) : (
        <label htmlFor="image" className={styles.fileCustom}>
          <div />
          <CameraIcon size={81} strokeWidth={1} />
          <p className={styles.fileCustomLabel}>(Optional) upload your image</p>
        </label>
      )}
      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
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
