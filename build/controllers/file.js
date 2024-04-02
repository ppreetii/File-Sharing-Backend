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
const validate_1 = require("../validation-schema/validate");
const file_1 = require("../validation-schema/file");
const request_validation_error_1 = require("../utils/errors/request-validation-error");
const file_2 = __importDefault(require("../services/file"));
const createFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, validate_1.validate)(file_1.createFileSchema, req.body);
        const { content } = req.body;
        yield file_2.default.createEncryptFile(content, req.currentUser);
        res.status(201).json({
            message: "File created successfully",
        });
    }
    catch (error) {
        if (error.isJoi) {
            next(new request_validation_error_1.RequestValidationError(error.details));
        }
        next(error);
    }
});
const getFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let username;
        if (req.headers.cookie) {
            username = req.headers.cookie.split('=')[1];
        }
        const files = yield file_2.default.getFiles(username);
        res.json(files);
    }
    catch (error) {
        next(error);
    }
});
const shareFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req.currentUser;
        const fileId = req.params.fileId;
        const { username } = req.body;
        yield (0, validate_1.validate)(file_1.shareFileSchema, { loggedInUser, fileId, username });
        yield file_2.default.shareFile(loggedInUser, fileId, username);
        res.json({
            message: "User added successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createFile,
    getFiles,
    shareFile
};
//# sourceMappingURL=file.js.map