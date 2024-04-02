"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("./configs/config"));
app_1.app.listen(config_1.default.port, () => {
    console.log(`Listening on port ${config_1.default.port}!`);
});
//# sourceMappingURL=index.js.map