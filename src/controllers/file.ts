import { Request, Response, NextFunction } from "express";

import { validate } from "../validation-schema/validate";
import { createFileSchema, shareFileSchema } from "../validation-schema/file";
import { RequestValidationError } from "../utils/errors/request-validation-error";
import fileServices from "../services/file";

const createFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validate(createFileSchema, req.body);
    const { content } = req.body;
    await fileServices.createEncryptFile(content, req.currentUser!);

    res.status(201).json({
      message: "File created successfully",
    });
  } catch (error: any) {
    
    if (error.isJoi) {
      next(new RequestValidationError(error.details));
    }

    next(error);
  }
};

const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let username;
    if(req.headers.cookie){
      username = req.headers.cookie.split('=')[1];
    }
    const files = await fileServices.getFiles(username);

    res.json(files);
  } catch (error: any) {
    next(error);
  }
};

const shareFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedInUser = req.currentUser!;
    const fileId = req.params.fileId;
    const {username} = req.body;
    await validate(shareFileSchema, {loggedInUser, fileId, username});
    await fileServices.shareFile(loggedInUser, fileId, username);

    res.json({
      message: "User added successfully"
    });
  } catch (error: any) {
    
    next(error);
  }
};

export default {
  createFile,
  getFiles,
  shareFile
};
