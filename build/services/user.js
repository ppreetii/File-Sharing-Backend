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
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const file_1 = require("../utils/helpers/file");
const bad_request_error_1 = require("../utils/errors/bad-request-error");
const constants_1 = require("../constants/constants");
const baseFilePath = path_1.default.join(__dirname, constants_1.CONSTANTS.FILE_BASEPATH);
const register = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFilePath = path_1.default.join(baseFilePath, "/users.json");
        const fileContent = yield getFileContent(userFilePath);
        if (!fileContent) {
            yield createAddUserFile(userFilePath, username);
        }
        else {
            yield updateUserFile(userFilePath, fileContent, username);
        }
        yield generateKeyPair(username);
    }
    catch (error) {
        throw error;
    }
});
function getFileContent(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileContent = yield (0, file_1.readFileStream)(path);
            return fileContent;
        }
        catch (error) {
            throw error;
        }
    });
}
function createAddUserFile(path, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {};
            data[`${username}`] = 1;
            yield promises_1.default.writeFile(path, JSON.stringify(data));
        }
        catch (error) {
            throw error;
        }
    });
}
function updateUserFile(path, fileContent, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = JSON.parse(fileContent);
            if (users[`${username}`]) {
                throw new bad_request_error_1.BadRequestError("Username already taken.");
            }
            users[`${username}`] = 1;
            yield promises_1.default.writeFile(path, JSON.stringify(users));
        }
        catch (error) {
            throw error;
        }
    });
}
function generateKeyPair(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const generateKeyPairPromise = util_1.default.promisify(crypto_1.default.generateKeyPair);
            const { privateKey, publicKey } = yield generateKeyPairPromise("rsa", {
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
            const publicKeyPath = path_1.default.join(baseFilePath, `/keys/${username}_public_key.pem`);
            const privateKeyPath = path_1.default.join(baseFilePath, `/keys/${username}_private_key.pem`);
            yield Promise.all([
                saveKeyToFile(publicKeyPath, publicKey),
                saveKeyToFile(privateKeyPath, privateKey),
            ]);
        }
        catch (error) {
            throw error;
        }
    });
}
function saveKeyToFile(path, key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.writeFile(path, key);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = {
    register,
};
//# sourceMappingURL=user.js.map