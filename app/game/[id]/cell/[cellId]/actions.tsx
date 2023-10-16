"use server";

import { uploadImage } from "@/lib/upload";

export async function daubCell(state: string | null, data: FormData) {
  const image = data.get("image");
  if (!(image == null || image instanceof File)) {
    return "Invalid input: image should be a file.";
  }
  if (image) {
    await uploadImage(image);
  }
}
