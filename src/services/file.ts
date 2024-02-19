import path from "path";
import crypto from "crypto";

import { readFileAsync, readFileStream, writeFileAsync } from "../utils/helpers/file";
import { NotFoundError } from "../utils/errors/not-found-error";
import { ForbiddenError } from "../utils/errors/forbidden-error";
import config from "../configs/config";
import { CONSTANTS } from "../constants/constants";

interface file {
  id: string;
  path: string;
  createdBy: string;
  sharedWith: string[];
}

const baseFilePath = config.nodeEnv === "production" ? CONSTANTS.PROD_FILE_BASEPATH : path.join(__dirname, CONSTANTS.LOCAL_FILE_BASEPATH)

const createEncryptFile = async (content: string, username: string) => {
  try {
    const encryptedData = await encryptContent(username, content);

    const { fileId, filePath } = await saveEncryptedFile(encryptedData);
    await saveFileMap(fileId, filePath, username);
  } catch (error) {
    throw error;
  }
};

const getFiles = async (username: string | undefined) => {
  try { 
    const files = await getAllFiles();

    for (let file of files) {
      let message = "";

      if (file.createdBy === username || file.sharedWith.includes(username as string)) {
        const privateKeyPath = path.join(
          baseFilePath,
          `/keys/${file.createdBy}_private_key.pem`
        );
        const privateKey = await readFileStream(privateKeyPath);
        message = (await decryptContent(privateKey, file.path)) as string;
      }

      file.decryptedContent = message;
    }

    return files;
  } catch (error) {
    throw error;
  }
};

const shareFile = async (
  loggedInUser: string,
  fileId: string,
  username: string
) => {
  try {
    const user = await checkUserExists(username);
    if(!user){
      throw new NotFoundError("User with given username Not Found")
    }
    const files = await getAllFiles();
    
    const index = files.findIndex((file: file )=> file.id === fileId);

    if(index === -1){
      throw new NotFoundError("File Not Found with given ID");
    }
    const fileData = files[index];
    if(fileData.createdBy !== loggedInUser){
      throw new ForbiddenError("This file doesn't belong to you.")
    }

    if(fileData.createdBy === username || fileData.sharedWith.includes(username)){
      return;
    }

    files[index].sharedWith.push(username);
    const filePath = path.join(baseFilePath, `/fileMap.json`);
    
    await writeFileAsync(filePath, files);
  } catch (error) {
    throw error;
  }
};

async function getAllFiles(){
  try {
    const filePath = path.join(baseFilePath, `/fileMap.json`);
    const fileContent = await readFileStream(filePath);
    
    if(!fileContent)return [];

    return JSON.parse(fileContent)
    
  } catch (error) {
    throw error;
  }
}

async function checkUserExists(username:string){
  try {
    const filePath = path.join(baseFilePath, `/users.json`);
    const fileContent = await readFileStream(filePath);
    const users = JSON.parse(fileContent);
    return users[username];
  } catch (error) {
    throw error;
  }
}

async function decryptContent(privateKey: string, filePath: string) {
  try {
    let encryptedText: string = await readFileStream(filePath);
    const decryptContent = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedText, "base64")
    );

    return decryptContent.toString();
  } catch (error) {
    throw error;
  }
}

async function encryptContent(username: string, content: string) {
  try {
    const publicKeyPath = path.join(
      baseFilePath,
      `/keys/${username}_public_key.pem`
    );

    const publicKey = await readFileAsync(publicKeyPath);
      
    const encryptedData = crypto.publicEncrypt(
      {
        key: Buffer.from(publicKey),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(content)
    );

    return encryptedData.toString("base64");
  } catch (error) {
    throw error;
  }
}

async function saveEncryptedFile(encryptedData: string) {
  try {
    const fileId = crypto.randomBytes(32).toString("hex");
    const filePath: string = path.join(baseFilePath, `/files/${fileId}.txt`);

    await writeFileAsync(filePath, encryptedData)
    return {
      fileId,
      filePath,
    };
  } catch (error) {
    throw error;
  }
}

async function saveFileMap(fileId: string, filePath: string, username: string) {
  try {
    const fileMapPath: string = path.join(baseFilePath, `/fileMap.json`);
    const fileContent = await readFileStream(fileMapPath);
    if (!fileContent) {
      await addFileMap(fileMapPath, {
        fileId,
        filePath,
        username,
      });
    } else {
      await updateFileMap(
        fileMapPath,
        {
          fileId,
          filePath,
          username,
        },
        fileContent
      );
    }
  } catch (error) {
    throw error;
  }
}

async function addFileMap(fileMapPath: string, fileData: any) {
  try {
    const data: file[] = [
      {
        id: fileData.fileId,
        path: fileData.filePath,
        createdBy: fileData.username,
        sharedWith: [],
      },
    ];

    await writeFileAsync(fileMapPath, data)
  } catch (error) {
    throw error;
  }
}

async function updateFileMap(
  fileMapPath: string,
  newFileData: any,
  fileContent: string
) {
  try {
    const data: file[] = JSON.parse(fileContent);

    data.push({
      id: newFileData.fileId,
      path: newFileData.filePath,
      createdBy: newFileData.username,
      sharedWith: [],
    });
    
    await writeFileAsync(fileMapPath, data);
  } catch (error) {
    throw error;
  }
}

export default {
  createEncryptFile,
  getFiles,
  shareFile,
};
