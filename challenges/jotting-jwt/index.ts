import debug from "debug";
import fetch from "node-fetch";
import { IData } from "./interface";
import { initalizeServer } from "./server";

const logger = debug("hackattic:jotting-jwt");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("JWT secret", data.jwt_secret);
  const appUrl = await initalizeServer(4040, data.jwt_secret);
  const message = {
    app_url: appUrl
  };
  logger("API url", message);
  const result = await sendOutput(submissionUrl, message);
  logger("Result = ", result);
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
