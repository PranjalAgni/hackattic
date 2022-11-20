import express, { Request, Response } from "express";
import ngrok from "ngrok";
import jwt from "jsonwebtoken";

import debug from "debug";
import { IBody } from "./interface";

const logger = debug("hackattic:jotting-jwt");

export const initalizeServer = async (port: number, jwtSecret: string) => {
  const app = express();

  // Set up middlewares
  app.use(function (req, res, next) {
    let rawBody = "";
    req.setEncoding("utf8");

    req.on("data", function (chunk: string) {
      rawBody += chunk;
    });

    req.on("end", function () {
      req.rawBody = rawBody;
      next();
    });
  });

  app.get("/", (_req: Request, res: Response) => {
    res.send("I am good");
  });

  let finalToken = "";
  app.post("/", (req: Request, res: Response) => {
    let decodedData: IBody = {};
    try {
      decodedData = jwt.verify(req.rawBody, jwtSecret) as IBody;
    } catch {
      logger("This is not valid token, unable to verify");
    }
    if (decodedData?.append !== undefined) {
      logger(decodedData);
      finalToken += String(decodedData.append);
      res.json({});
    } else {
      logger("Dispatching final token ", finalToken);
      res.json({ solution: finalToken });
    }
  });

  app.listen(port, () => {
    logger(`Server running on http://localhost:${port} 🚀`);
  });

  const url = await createNgrokTunnel(port);
  logger("Ngrok url:", url);
  return url;
};

const createNgrokTunnel = async (port: number) => {
  const url = await ngrok.connect({
    proto: "http",
    addr: port
  });

  return url;
};
