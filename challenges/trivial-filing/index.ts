import tftp from "tftp";
import debug from "debug";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { IData, IFile } from "./interface";
import { initServer } from "./server";

const logger = debug("hackattic:trivial-filing");
const PORT = 6969;
const TEMP_DIR = path.join(__dirname, "temp");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  initServer(PORT);
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data.files);
  await writeFiles(data.files);
  await sendFilesToServer(data.files);
  const message = {
    tftp_host: process.env.PUBLIC_IP,
    tftp_port: PORT
  };
  const result = await sendOutput(submissionUrl, message);
  logger(`Result = ${result}`);
};

const createTftpClient = () => {
  return tftp.createClient({
    host: "localhost",
    port: PORT
  });
};

const writeFiles = async (files: IFile) => {
  const filePromises = Object.entries(files).map(([key, value]) => {
    const filePath = path.join(TEMP_DIR, key);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, value, (error) => {
        if (error !== null) {
          return reject(new Error("Cannot write file"));
        }
        resolve("Successfully wrote file");
      });
    });
  });

  await Promise.allSettled(filePromises);
  logger("Done writing files");
};

const sendFilesToServer = async (files: IFile) => {
  const client = createTftpClient();
  const sendFilePromise = Object.entries(files).map(([key, value]) => {
    const filePath = path.join(TEMP_DIR, key);
    return new Promise((resolve, reject) => {
      client.put(filePath, async function (error: string) {
        if (error !== undefined) {
          logger("Error", error);
          reject(error);
        }

        await fs.unlink(filePath, (error) => {
          if (error !== null) {
            return logger("Unable to delete file ", filePath);
          }
        });
        resolve("Sent to the server");
      });
    });
  });

  await Promise.allSettled(sendFilePromise);
  logger("Sent files to server");
};

const fetchInput = async (problemUrl: string): Promise<IData | null> => {
  try {
    const response = await fetch(problemUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    logger(error);
  }
  return null;
};

const sendOutput = async (
  submissionUrl: string,
  message: unknown
): Promise<string> => {
  const response = await fetch(submissionUrl, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });

  const res = await response.text();
  return res;
};
