"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const custom_error_1 = require("./custom-error");
class ForbiddenError extends custom_error_1.CustomError {
    constructor(message) {
        super("Forbidden");
        this.message = message;
        this.statusCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serializeErrors() {
        return [
            {
                message: this.message,
            },
        ];
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=forbidden-error.js.map