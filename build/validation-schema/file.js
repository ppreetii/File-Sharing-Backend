"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareFileSchema = exports.createFileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFileSchema = joi_1.default.object().keys({
    content: joi_1.default.string().required()
});
exports.shareFileSchema = joi_1.default.object().keys({
    loggedInUser: joi_1.default.string().required(),
    fileId: joi_1.default.string().length(64).required().messages({ "string.length": "Invalid File ID" }),
    username: joi_1.default.string().required()
});
//# sourceMappingURL=file.js.map