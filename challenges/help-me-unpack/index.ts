import debug from "debug";
import fetch from "node-fetch";

const logger = debug("hackattic:help-me-unpack");

export const solver = async (problemUrl: string, submissionUrl: string) => {
  await fetchInput(problemUrl);
  console.log("Solve this now");
};

const fetchInput = async (problemUrl: string) => {
  try {
    const response = await fetch(problemUrl);
    const data = await response.json();
    logger("%O", data);
  } catch (error) {
    logger(error);
  }
};
