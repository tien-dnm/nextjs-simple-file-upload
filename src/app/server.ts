"use server";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import path from "path";

export interface DirResult {
  path: string[];
  type: "folder" | "image" | "video";
}

const uploadPath = path.join(process.cwd(), "public", "upload");

const folderExists = (folderPath: string) => {
  try {
    return existsSync(folderPath);
  } catch (err) {
    return false;
  }
};
const createFolderWithNumber = (
  folderName: string,
  number: number,
  ...slugs: string[]
) => {
  return tryCatchWrapper(() => {
    const fullPath = path.join(uploadPath, ...slugs);
    const folderNameWithNumber = `${folderName}_${number}`;
    const newFolderPath = path.join(fullPath, folderNameWithNumber);
    if (folderExists(newFolderPath)) {
      // If the folder with the number already exists, recursively call the function with an incremented number
      createFolderWithNumber(folderName, number + 1, ...slugs);
    } else {
      mkdirSync(newFolderPath, { recursive: true });
    }
  });
};

export async function submitForm(formData: FormData, ...slugs: string[]) {
  return tryCatchWrapper(async () => {
    const fullPath = path.join(uploadPath, ...slugs);
    const files = formData.getAll("file");
    const res: string[] = [];
    for (const file of files) {
      if (file instanceof Blob) {
        const miti = await file.arrayBuffer();
        const buffer = Buffer.from(miti);
        const fullFile = path.join(fullPath, file.name);
        if (!existsSync(fullPath)) {
          mkdirSync(fullPath, { recursive: true });
        }
        writeFileSync(fullFile, buffer);
        res.push(file.name);
      }
    }
    return res;
  });
}

const readDirectory = (...slugs: string[]) => {
  return tryCatchWrapper(() => {
    const fullPath = path.join(uploadPath, ...slugs);
    let files: DirResult[] = [];
    const items = readdirSync(fullPath);
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      if (statSync(itemPath).isDirectory()) {
        files.push({
          path: [...slugs, item],
          type: "folder",
        });
      } else {
        files.push({
          path: [...slugs, item],
          type: "image",
        });
      }
    }
    return files;
  });
};

export async function getFiles(...slugs: string[]) {
  return tryCatchWrapper(() => {
    const fullPath = path.join(uploadPath, ...slugs);
    const exist = existsSync(fullPath);
    if (exist) {
      const dir = readDirectory(...slugs);
      return dir;
    }
    return [];
  });
}

export async function newFolder(...slugs: string[]) {
  return tryCatchWrapper(() => {
    return createFolderWithNumber("New Folder", 1, ...slugs);
  });
}

function tryCatchWrapper<T>(func: () => T): T | undefined {
  try {
    return func();
  } catch (error) {
    console.error("An error occurred:", error);
    return undefined;
  }
}
