import fs from "node:fs/promises";
import path from "path";
import crypto from "crypto";
import util from "util";

import { readFileStream } from "../utils/helpers/file";

import { BadRequestError } from "../utils/errors/bad-request-error";

const register = async (username: string) => {
  try {
    const userFilePath: string = path.join(__dirname, "/../db/users.json");
    const fileContent = await getFileContent(userFilePath);

    if (!fileContent) {
      await createAddUserFile(userFilePath, username);
    } else {
      await updateUserFile(userFilePath, fileContent, username);
    }

    await generateKeyPair(username);
  } catch (error) {
    throw error;
  }
};

async function getFileContent(path: string) {
  try {
    const fileContent = await readFileStream(path);

    return fileContent;
  } catch (error) {
    throw error;
  }
}

async function createAddUserFile(path: string, username: string) {
  try {
    const data: any = {};
    data[`${username}`] = 1;
    await fs.writeFile(path, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
}

async function updateUserFile(
  path: string,
  fileContent: string,
  username: string
) {
  try {
    const users = JSON.parse(fileContent);
    if (users[`${username}`]) {
      throw new BadRequestError("Username already taken.");
    }

    users[`${username}`] = 1;

    await fs.writeFile(path, JSON.stringify(users));
  } catch (error) {
    throw error;
  }
}

async function generateKeyPair(username: string) {
  try {
    const generateKeyPairPromise = util.promisify(crypto.generateKeyPair);
    const { privateKey, publicKey } = await generateKeyPairPromise("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const publicKeyPath: string = path.join(
      __dirname,
      `/../db/keys/${username}_public_key.pem`
    );
    const privateKeyPath: string = path.join(
      __dirname,
      `/../db/keys/${username}_private_key.pem`
    );

    await Promise.all([
      saveKeyToFile(publicKeyPath, publicKey),
      saveKeyToFile(privateKeyPath, privateKey),
    ]);
  } catch (error) {
    throw error;
  }
}

async function saveKeyToFile(path: string, key: string) {
  try {
    await fs.writeFile(path, key);
  } catch (error) {
    throw error;
  }
}

export default {
  register,
};
