import debug from "debug";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import LineReader from "n-readlines";

import { IData } from "./interface";

const logger = debug("hackattic:brute-force-zip");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const passwordList = getPasswordsList(path.join(__dirname, "rockyou.txt"));
  logger("Total Passwords: ", passwordList.length);
  const data = await fetchInput(problemUrl);
  if (data === null) return;
  logger("Zip package: ", data.zip_url);
  const zipPath = path.join(__dirname, "store", "file.zip");
  await downloadFile(data.zip_url, zipPath);
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

const getPasswordsList = (passwordFile: string) => {
  const passwordList = [];
  const lineReader = new LineReader(passwordFile);
  let line = lineReader.next();
  while (line !== null) {
    passwordList.push(line.toString("utf-8"));
    line = lineReader.next();
  }

  return passwordList;
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

// const sendOutput = async (
//   submissionUrl: string,
//   message: unknown
// ): Promise<string> => {
//   const response = await fetch(submissionUrl, {
//     method: "POST",
//     headers: {
//       Accept: "application.json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(message)
//   });

//   const res = await response.text();
//   return res;
// };
