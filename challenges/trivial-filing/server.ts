import tftp from "tftp";
import path from "path";
import debug from "debug";

const logger = debug("hackattic:trivial-filing");
const dataDirectory = path.join(__dirname, "data");

// This is simple tftp server which handles the GET/PUT of files
export const initServer = (port: number) => {
  const tftpServer = tftp.createServer({
    host: process.env.PUBLIC_IP ?? "0.0.0.0",
    port,
    root: dataDirectory
  });

  tftpServer.listen();
  logger("Started tftp server");
};
