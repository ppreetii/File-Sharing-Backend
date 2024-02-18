import express from "express";

import userController from "../controllers/user";
import { API } from "../constants/api";

const router = express.Router();

router.post(`${API.REGISTER}`, userController.register);

export {router as UserRoute};