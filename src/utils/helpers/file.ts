import {createReadStream, createWriteStream, readFile, writeFile} from "node:fs";
import util from 'util';

export async function readFileStream(path: string):Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = createReadStream(path, { encoding: "utf-8" });

    let fileContent: string = "";
    reader.on("data", function (chunk: string) {
      fileContent += chunk;
    });
    reader.on("error", function (err:any) {
      reject(err);
    });
    reader.on("end", async function () {
      resolve(fileContent);
    });
  });
}

export async function writeFileStream(path: string, data: any) {
  return new Promise((resolve, reject) => {
    const writer = createWriteStream(path, { encoding: "utf-8" });
    writer.write(JSON.stringify(data));

    writer.on("finish" , function(){
        resolve("File Saved");
    });

    writer.on("error" , function(err){
        reject(err);
    });

    writer.end();
  });
}

export async function writeFileAsync(path:string, data:any){
  try {
    const writeToFile = util.promisify(writeFile);
    await writeToFile(path, JSON.stringify(data) , {
      encoding: "utf-8",
    });
  } catch (error) {
    throw new Error("Failed to read the file");
  }
}
export async function readFileAsync(path:string){
  try {
    const readFileContent = util.promisify(readFile);
    const fileContent = await readFileContent(path, { encoding: "utf-8" });
    return fileContent;
  } catch (error) {
    throw new Error("Failed to read the file");
  }
}


