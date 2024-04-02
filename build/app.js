"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const user_1 = require("./routes/user");
const file_1 = require("./routes/file");
const api_1 = require("./constants/api");
const error_handler_1 = require("./middlewares/error-handler");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(`${api_1.API.BASE_URL}${api_1.API.USER}`, user_1.UserRoute);
app.use(`${api_1.API.BASE_URL}${api_1.API.FILE}`, file_1.FileRoute);
app.get('/', (req, res, next) => {
    res.json({
        message: "Welcome. Secure File Sharing Backend APIs are live!"
    });
});
app.all("*", () => {
    throw new Error("Page Not Found");
});
app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map