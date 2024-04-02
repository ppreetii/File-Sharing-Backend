"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRoute = void 0;
const express_1 = __importDefault(require("express"));
const file_1 = __importDefault(require("../controllers/file"));
const api_1 = require("../constants/api");
const is_registered_1 = require("../middlewares/is-registered");
const router = express_1.default.Router();
exports.FileRoute = router;
router.post("/", is_registered_1.isRegistered, file_1.default.createFile);
router.patch(api_1.API.FILE_ID, is_registered_1.isRegistered, file_1.default.shareFile);
router.get("/", file_1.default.getFiles);
//# sourceMappingURL=file.js.map