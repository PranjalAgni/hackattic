import debug from "debug";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import LineReader from "n-readlines";
import unzipper from "unzipper";
import { IData } from "./interface";

const logger = debug("hackattic:brute-force-zip");
const PASSWORD_FILE = path.join(__dirname, "rockyou.txt");
const ZIP_PATH = path.join(__dirname, "store", "file.zip");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data = await fetchInput(problemUrl);
  if (data === null) return;
  logger("Zip package: ", data.zip_url);
  await downloadFile(data.zip_url, ZIP_PATH);
  const answer = await bruteForceSolver(PASSWORD_FILE, ZIP_PATH);
  logger("Answer: ", answer);
  const result = await sendOutput(submissionUrl, { secret: answer });
  logger("Result: ", result);
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

const getZipFileInstance = async (zipPath: string) => {
  const directory = await unzipper.Open.file(zipPath);
  const file = directory.files.find((d) => d.path === "secret.txt");
  return file;
};

const bruteForceSolver = async (passwordFile: string, zipPath: string) => {
  const file = await getZipFileInstance(zipPath);
  if (file === undefined) throw new Error("No file found");
  const lineReader = new LineReader(passwordFile);
  let line = lineReader.next();
  while (line !== null) {
    const password = line.toString("utf-8");
    if (password.length >= 4 && password.length <= 6) {
      try {
        const content = await file.buffer(password);
        logger("Password found: ", password);
        return content.toString("ascii");
      } catch {
        logger("Cannot open via this password: ", password);
      }
    }

    line = lineReader.next();
  }
};

const downloadFile = async (zipUrl: string, path: string) => {
  const res = await fetch(zipUrl);
  const filestream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(filestream);
    res.body.on("error", reject);
    filestream.on("finish", resolve);
  });
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
