import express, { Request, Response } from "express";
import debug from "debug";
import { fileDB } from "./db";

const logger = debug("hackattic:trivial-filing");

export const initServer = (port: number) => {
  const app = express();
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    logger(`Request body ${JSON.stringify(req.body)}`);
    return res.json(fileDB);
  });

  app.listen(port, () => {
    logger(`Server running on http://localhost:${port}`);
  });
};
