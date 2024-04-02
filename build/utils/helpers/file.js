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
exports.readFileAsync = exports.writeFileAsync = exports.writeFileStream = exports.readFileStream = void 0;
const node_fs_1 = require("node:fs");
const util_1 = __importDefault(require("util"));
function readFileStream(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = (0, node_fs_1.createReadStream)(path, { encoding: "utf-8" });
            let fileContent = "";
            reader.on("data", function (chunk) {
                fileContent += chunk;
            });
            reader.on("error", function (err) {
                reject(err);
            });
            reader.on("end", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    resolve(fileContent);
                });
            });
        });
    });
}
exports.readFileStream = readFileStream;
function writeFileStream(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const writer = (0, node_fs_1.createWriteStream)(path, { encoding: "utf-8" });
            writer.write(JSON.stringify(data));
            writer.on("finish", function () {
                resolve("File Saved");
            });
            writer.on("error", function (err) {
                reject(err);
            });
            writer.end();
        });
    });
}
exports.writeFileStream = writeFileStream;
function writeFileAsync(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const writeToFile = util_1.default.promisify(node_fs_1.writeFile);
            yield writeToFile(path, JSON.stringify(data), {
                encoding: "utf-8",
            });
        }
        catch (error) {
            throw new Error("Failed to read the file");
        }
    });
}
exports.writeFileAsync = writeFileAsync;
function readFileAsync(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const readFileContent = util_1.default.promisify(node_fs_1.readFile);
            const fileContent = yield readFileContent(path, { encoding: "utf-8" });
            return fileContent;
        }
        catch (error) {
            throw new Error("Failed to read the file");
        }
    });
}
exports.readFileAsync = readFileAsync;
//# sourceMappingURL=file.js.map