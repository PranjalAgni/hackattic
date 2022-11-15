/* eslint-disable @typescript-eslint/no-explicit-any */
import tftp from "tftp2";
import debug from "debug";

const logger = debug("hackattic:trivial-filing");

// This is simple tftp server which handles the GET/PUT of files
export const createAndRunTftpServer = (host: string, port: number) => {
  const server = tftp.createServer(host, port);
  server.on("get", async (req: any, send: any) => {
    const { filename } = req;
    logger("Request arrived for ", filename);
    await send("hello world");
  });

  server.listen(port);

  return server;
};
