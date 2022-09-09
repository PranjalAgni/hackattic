import debug from "debug";
import fetch from "node-fetch";
import { IBytes } from "./interface";

const logger = debug("hackattic:help-me-unpack");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data = await fetchInput(problemUrl);
  if (data === null) return;
  const { bytes } = data;
  logger(`Extract asked values from base64 bytes ${bytes}`);
};

const fetchInput = async (problemUrl: string): Promise<IBytes | null> => {
  try {
    const response = await fetch(problemUrl);
    const data = await response.json();
    logger("%O", data.toString());
    return data;
  } catch (error) {
    logger(error);
  }
  return null;
};
