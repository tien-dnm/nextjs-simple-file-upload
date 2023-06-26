"use server";
import { writeFileSync, mkdir } from "fs";
import path from "path";
export async function submitForm(formData: FormData) {
  const uploadPath = path.join(process.cwd(), "public", "upload");
  const files = formData.getAll("file");
  for (const file of files) {
    if (file instanceof Blob) {
      const miti = await file.arrayBuffer();
      const buffer = Buffer.from(miti);
      const fullFile = path.join(uploadPath, file.name);
      mkdir(uploadPath, () => {
        writeFileSync(fullFile, buffer);
      });
    }
  }
}
