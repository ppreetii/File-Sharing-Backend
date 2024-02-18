import express from "express";
import cors from "cors";

import { UserRoute } from "./routes/user";
import { FileRoute } from "./routes/file";
import { API } from "./constants/api";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(express.json());
app.use(cors());

app.use(`${API.BASE_URL}${API.USER}`, UserRoute);
app.use(`${API.BASE_URL}${API.FILE}`, FileRoute);

app.use(errorHandler);

export { app };
