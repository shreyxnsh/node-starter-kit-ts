import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import database from "./configs/database";

import { errorHandler } from "./middleware/exceptions/handler";
import { RESPONSE_MESSAGE } from "./utils/response-message";
import { attachResponseHelpers } from "./middleware/response.middleware";

dotenv.config({
  path: ".env",
});

import env from "./configs/env";

const main = async () => {
  const app: Application = express();
  const port = env.PORT;

  app.use(attachResponseHelpers);
  app.use(express.json({ limit: "50mb" }));
  app.use(cors({ origin: "*", credentials: true }));
  // app.use(ExpressStatusMonitor());

  // Server Check
  app.use("/", (_: Request, res: Response) => {
    res.success(RESPONSE_MESSAGE.SERVER_RUNNING);
  });

  // Error handler
  app.use(errorHandler);

  await database();

  app.listen(port, () =>
    console.log(`Server is live at http://localhost:${port}/api!`)
  );
};

main();
