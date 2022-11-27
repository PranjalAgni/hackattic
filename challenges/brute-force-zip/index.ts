import debug from "debug";
import fetch from "node-fetch";
import { IData } from "./interface";

const logger = debug("hackattic:brute-force-zip");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data = await fetchInput(problemUrl);
  if (data === null) return;
  logger("Zip package: ", data.zip_url);
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
