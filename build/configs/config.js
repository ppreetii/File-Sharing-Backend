"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000,
    nodeEnv: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : "development"
};
//# sourceMappingURL=config.js.map