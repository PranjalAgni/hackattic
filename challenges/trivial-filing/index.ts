import debug from "debug";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { IData, IFile } from "./interface";
import { createAndRunTftpServer } from "./server2";

const logger = debug("hackattic:trivial-filing");
const HOST = "0.0.0.0";
const PORT = 6969;
const DATA_DIR = path.join(__dirname, "data");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  createAndRunTftpServer(HOST, PORT);
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data.files);
  await writeFiles(data.files);
  const message = {
    tftp_host: process.env.PUBLIC_IP,
    tftp_port: PORT
  };

  logger("%O", message);
  const result = await sendOutput(submissionUrl, message);
  logger(`Result = ${result}`);
};

const writeFiles = async (files: IFile) => {
  const filePromises = Object.entries(files).map(([key, value]) => {
    const filePath = path.join(DATA_DIR, key);
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
  logger("Wrote all the files");
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
