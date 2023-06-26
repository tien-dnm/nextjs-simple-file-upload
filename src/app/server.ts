"use server";
import { writeFileSync, mkdir, readdir, readdirSync } from "fs";
import path from "path";
export async function submitForm(formData: FormData) {
  const uploadPath = path.join(process.cwd(), "public", "upload");
  const files = formData.getAll("file");
  const res: string[] = [];
  for (const file of files) {
    if (file instanceof Blob) {
      const miti = await file.arrayBuffer();
      const buffer = Buffer.from(miti);
      const fullFile = path.join(uploadPath, file.name);
      mkdir(uploadPath, () => {
        writeFileSync(fullFile, buffer);
        res.push(file.name);
      });
    }
  }
  return res;
}

export async function getFiles() {
  const uploadPath = path.join(process.cwd(), "public", "upload");
  const dir = readdirSync(uploadPath);
  return dir;
}
