import { Request, Response, NextFunction } from "express";

import { validate } from "../validation-schema/validate";
import { registerSchema } from "../validation-schema/user";
import { RequestValidationError } from "../utils/errors/request-validation-error";
import userServices from "../services/user";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validate(registerSchema, req.body);
    const { username } = req.body;
    await userServices.register(username);

    res.setHeader('Set-Cookie', `username=${username}; HttpOnly ; Path=/`)
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.isJoi) {
      next(new RequestValidationError(error.details));
    }

    next(error);
  }
};

export default {
  register,
};
