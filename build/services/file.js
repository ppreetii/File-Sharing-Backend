"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const file_1 = require("../utils/helpers/file");
const not_found_error_1 = require("../utils/errors/not-found-error");
const forbidden_error_1 = require("../utils/errors/forbidden-error");
const config_1 = __importDefault(require("../configs/config"));
const constants_1 = require("../constants/constants");
const baseFilePath = config_1.default.nodeEnv === "production" ? path_1.default.join(process.cwd(), constants_1.CONSTANTS.FILE_BASEPATH) : path_1.default.join(__dirname, constants_1.CONSTANTS.FILE_BASEPATH);
const createEncryptFile = (content, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encryptedData = yield encryptContent(username, content);
        const { fileId, filePath } = yield saveEncryptedFile(encryptedData);
        yield saveFileMap(fileId, filePath, username);
    }
    catch (error) {
        throw error;
    }
});
const getFiles = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield getAllFiles();
        for (let file of files) {
            let message = "";
            if (file.createdBy === username || file.sharedWith.includes(username)) {
                const privateKeyPath = path_1.default.join(baseFilePath, `/keys/${file.createdBy}_private_key.pem`);
                const privateKey = yield (0, file_1.readFileStream)(privateKeyPath);
                message = (yield decryptContent(privateKey, file.path));
            }
            file.decryptedContent = message;
        }
        return files;
    }
    catch (error) {
        throw error;
    }
});
const shareFile = (loggedInUser, fileId, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield checkUserExists(username);
        if (!user) {
            throw new not_found_error_1.NotFoundError("User with given username Not Found");
        }
        const files = yield getAllFiles();
        const index = files.findIndex((file) => file.id === fileId);
        if (index === -1) {
            throw new not_found_error_1.NotFoundError("File Not Found with given ID");
        }
        const fileData = files[index];
        if (fileData.createdBy !== loggedInUser) {
            throw new forbidden_error_1.ForbiddenError("This file doesn't belong to you.");
        }
        if (fileData.createdBy === username || fileData.sharedWith.includes(username)) {
            return;
        }
        files[index].sharedWith.push(username);
        const filePath = path_1.default.join(baseFilePath, `/fileMap.json`);
        yield (0, file_1.writeFileAsync)(filePath, files);
    }
    catch (error) {
        throw error;
    }
});
function getAllFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path_1.default.join(baseFilePath, `/fileMap.json`);
            const fileContent = yield (0, file_1.readFileStream)(filePath);
            if (!fileContent)
                return [];
            return JSON.parse(fileContent);
        }
        catch (error) {
            throw error;
        }
    });
}
function checkUserExists(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path_1.default.join(baseFilePath, `/users.json`);
            const fileContent = yield (0, file_1.readFileStream)(filePath);
            const users = JSON.parse(fileContent);
            return users[username];
        }
        catch (error) {
            throw error;
        }
    });
}
function decryptContent(privateKey, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let encryptedText = yield (0, file_1.readFileStream)(filePath);
            const decryptContent = crypto_1.default.privateDecrypt({
                key: privateKey,
                padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            }, Buffer.from(encryptedText, "base64"));
            return decryptContent.toString();
        }
        catch (error) {
            throw error;
        }
    });
}
function encryptContent(username, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const publicKeyPath = path_1.default.join(baseFilePath, `/keys/${username}_public_key.pem`);
            const publicKey = yield (0, file_1.readFileAsync)(publicKeyPath);
            const encryptedData = crypto_1.default.publicEncrypt({
                key: Buffer.from(publicKey),
                padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            }, Buffer.from(content));
            return encryptedData.toString("base64");
        }
        catch (error) {
            throw error;
        }
    });
}
function saveEncryptedFile(encryptedData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileId = crypto_1.default.randomBytes(32).toString("hex");
            const filePath = path_1.default.join(baseFilePath, `/files/${fileId}.txt`);
            yield (0, file_1.writeFileAsync)(filePath, encryptedData);
            return {
                fileId,
                filePath,
            };
        }
        catch (error) {
            throw error;
        }
    });
}
function saveFileMap(fileId, filePath, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileMapPath = path_1.default.join(baseFilePath, `/fileMap.json`);
            const fileContent = yield (0, file_1.readFileStream)(fileMapPath);
            if (!fileContent) {
                yield addFileMap(fileMapPath, {
                    fileId,
                    filePath,
                    username,
                });
            }
            else {
                yield updateFileMap(fileMapPath, {
                    fileId,
                    filePath,
                    username,
                }, fileContent);
            }
        }
        catch (error) {
            throw error;
        }
    });
}
function addFileMap(fileMapPath, fileData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = [
                {
                    id: fileData.fileId,
                    path: fileData.filePath,
                    createdBy: fileData.username,
                    sharedWith: [],
                },
            ];
            yield (0, file_1.writeFileAsync)(fileMapPath, data);
        }
        catch (error) {
            throw error;
        }
    });
}
function updateFileMap(fileMapPath, newFileData, fileContent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = JSON.parse(fileContent);
            data.push({
                id: newFileData.fileId,
                path: newFileData.filePath,
                createdBy: newFileData.username,
                sharedWith: [],
            });
            yield (0, file_1.writeFileAsync)(fileMapPath, data);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = {
    createEncryptFile,
    getFiles,
    shareFile,
};
//# sourceMappingURL=file.js.map