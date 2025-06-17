import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export function ensureDirExists() {
  const dirPath = path.resolve(process.cwd(), "static/newsDocuments");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

export async function prepareUploadedFiles(files, savedFilePaths, newsId = null) {
  const uploadedFiles = [];

  if (!files) return uploadedFiles;

  const documentsArray = Array.isArray(files) ? files : [files];

  for (const file of documentsArray) {
    const ext = path.extname(file.name);
    const filename = uuidv4() + ext;
    const fullPath = path.join(ensureDirExists(), filename);

    savedFilePaths.push({ file, fullPath, filename });

    uploadedFiles.push({
      url: filename,
      type: ext.replace(".", ""),
      ...(newsId && { NewsId: newsId }),
    });
  }

  return uploadedFiles;
}

export async function moveUploadedFiles(savedFilePaths) {
  for (const { file, fullPath } of savedFilePaths) {
    await file.mv(fullPath);
  }
}

export function removeFiles(paths) {
  for (const file of paths) {
    const filePath = typeof file === "string" ? file : file.fullPath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
