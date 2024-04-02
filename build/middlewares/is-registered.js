"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegistered = void 0;
const forbidden_error_1 = require("../utils/errors/forbidden-error");
const isRegistered = (req, res, next) => {
    if (!req.headers.cookie) {
        throw new forbidden_error_1.ForbiddenError("Please Register first.");
    }
    const username = req.headers.cookie.split('=')[1];
    req.currentUser = username;
    next();
};
exports.isRegistered = isRegistered;
//# sourceMappingURL=is-registered.js.map