import debug from "debug";
import fetch from "node-fetch";
import ngrok from "ngrok";
import { addFiles } from "./db";
import { IData } from "./interface";
import { initServer } from "./server";

const logger = debug("hackattic:trivial-filing");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const PORT = 3000;
  initServer(PORT);
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data.files);
  addFiles(data.files);
  await ngrok.authtoken("2F7Jw1tSnSsRK40CMk6QEcmdqHI_59R4fvMpGSGit2PKedeou");
  const url = await ngrok.connect(PORT);
  logger(`Ngrok url = ${url}`);
  const message = {
    tftp_host: url.split("https://")[1],
    tftp_port: 443
  };
  const result = await sendOutput(submissionUrl, message);
  logger(`Result = ${result}`);
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
