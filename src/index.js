import express from "express";
import multer from "multer";
import "dotenv/config";
import { usersRouter as usersRoutes } from "./user/routes/users.routes.js";
import blogRouter from "./blog/routes/blog.route.js";
import "./global/configs/db.js";
import logger from "./global/utils/logger.util.js";
import { initRedis } from "./global/configs/redis.js";
import cors from "cors";

const app = express();
initRedis();
app.use(express.json());
app.use(multer().array());

app.use(cors());
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", usersRoutes);
app.use("/api/blog", blogRouter);

app.listen(process.env.PORT, () => {
  logger.info(`Server is running at port ${process.env.PORT}`);
});
