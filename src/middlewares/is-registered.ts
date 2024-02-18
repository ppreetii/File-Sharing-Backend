import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors/forbidden-error";

declare global {
    namespace Express {
      interface Request {
        currentUser?: string;
      }
    }
  }

export const isRegistered = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    if(!req.headers.cookie){
        throw new ForbiddenError("Please Register first.")
    }

    const username = req.headers.cookie.split('=')[1];
    req.currentUser  = username;
    
    next();
};
