import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import Config from "./config/index";
import { HomeRoutes } from "./routes/home";
import "./config/Init/initTypeMySQL"

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/", HomeRoutes);
app.use(Config.Errors.Error404);
app.use(Config.Errors.ErrorHandlder);

export default app.listen(Config.Env.server.PORT, () =>
  console.log(`Server on => http://localhost:${Config.Env.server.PORT}`)
);
