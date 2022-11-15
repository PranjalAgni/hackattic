/* eslint-disable @typescript-eslint/no-explicit-any */
import tftp from "tftp2";
import debug from "debug";
import path from "path";
import fs from "fs/promises";

const logger = debug("hackattic:trivial-filing");
const dataDirectory = path.join(__dirname, "data");

// This is simple tftp server which handles the GET/PUT of files
export const createAndRunTftpServer = (host: string, port: number) => {
  const server = tftp.createServer(host, port);
  server.on("get", async (req: any, send: any) => {
    const { filename } = req;
    logger("Request arrived for ", filename);
    const data = await fs.readFile(path.resolve(dataDirectory, filename));
    logger(`Data ${data.toString("utf-8")}`);
    await send(data);
    logger("Sent data back");
  });

  server.listen(port);
  logger("TFTP server listening 🚀");
  return server;
};

createAndRunTftpServer("0.0.0.0", 6969);
