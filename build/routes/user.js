"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const api_1 = require("../constants/api");
const router = express_1.default.Router();
exports.UserRoute = router;
router.post(`${api_1.API.REGISTER}`, user_1.default.register);
//# sourceMappingURL=user.js.map