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
const user_1 = require("../validation-schema/user");
const request_validation_error_1 = require("../utils/errors/request-validation-error");
const user_2 = __importDefault(require("../services/user"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, validate_1.validate)(user_1.registerSchema, req.body);
        const { username } = req.body;
        yield user_2.default.register(username);
        res.setHeader('Set-Cookie', `username=${username}; HttpOnly ; Path=/`);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        if (error.isJoi) {
            next(new request_validation_error_1.RequestValidationError(error.details));
        }
        next(error);
    }
});
exports.default = {
    register,
};
//# sourceMappingURL=user.js.map