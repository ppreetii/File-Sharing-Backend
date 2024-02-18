import express from "express";

import fileController from "../controllers/file";
import { API } from "../constants/api";
import { isRegistered } from "../middlewares/is-registered";

const router = express.Router();

router.post("/", isRegistered ,fileController.createFile);
router.patch(API.FILE_ID, isRegistered ,fileController.shareFile);
router.get("/", fileController.getFiles);

export {router as FileRoute};