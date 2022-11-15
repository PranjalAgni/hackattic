/* eslint-disable @typescript-eslint/no-explicit-any */
import tftp from "tftp";
import path from "path";
import debug from "debug";
import { IRequest } from "./interface";

const logger = debug("hackattic:trivial-filing");
const dataDirectory = path.join(__dirname, "data");

// This is simple tftp server which handles the GET/PUT of files
export const createAndRunTftpServer = (host: string, port: number) => {
  const tftpServer = tftp.createServer({
    host,
    port,
    root: dataDirectory
  });

  tftpServer.on("error", function (error: any) {
    logger("Error occured on tftpServer root", error);
  });

  tftpServer.on("request", function (req: IRequest, res: any) {
    req.on("error", function (error: { message: string }) {
      logger(
        `Error occured on this request root [${req.stats.remoteAddress}:${req.stats.remotePort}(${req.file})] `
      );
      logger(`Error message ${error.message}`);
    });
  });

  tftpServer.on("listening", function () {
    logger("Tftp server listening now 🚀");
  });

  tftpServer.listen();
  logger("Started tftp server");
  return tftpServer;
};
