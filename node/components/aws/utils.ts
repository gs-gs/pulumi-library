import * as fs from "fs";
import * as path from "path";

export const getAllFiles = function (dirPath: string, arrayOfFiles: Array<string>) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, "../", dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};
