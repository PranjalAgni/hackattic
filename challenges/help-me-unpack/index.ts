import debug from "debug";
import fetch from "node-fetch";

const logger = debug("hackattic:help-me-unpack");

export const solver = async (problemUrl: string, submissionUrl: string) => {
  const data = await fetchInput(problemUrl);
  if (!data) return;
  const { bytes } = data;
  console.log("Extract asked values from base64 bytes", bytes);
};

const fetchInput = async (problemUrl: string) => {
  try {
    const response = await fetch(problemUrl);
    const data = await response.json();
    logger("%O", data);
    return data;
  } catch (error) {
    logger(error);
  }
  return null;
};
