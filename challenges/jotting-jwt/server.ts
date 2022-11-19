import express, { Request, Response } from "express";
import ngrok from "ngrok";
import debug from "debug";

const logger = debug("hackattic:jotting-jwt");

export const initalizeServer = async (port: number) => {
  const app = express();

  // Set up middlewares
  app.use(
    express.urlencoded({
      extended: true
    })
  );

  app.get("/", (_req: Request, res: Response) => {
    res.send("I am good");
  });

  app.post("/", (req: Request, res: Response) => {
    logger("Post request hit %O", req.body);
    res.json({ message: "I am currently in progress" });
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
