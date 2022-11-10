import debug from "debug";
import HttpsProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";
import { IData, IProxy } from "./interface";

const logger = debug("hackattic:global-presence");

const BASE_API_URL = "https://hackattic.com/_/presence/";
const ProxyList: IProxy[] = [
  {
    type: "http",
    host: "133.242.171.216",
    port: 3128
  },
  {
    type: "http",
    host: "190.107.234.139",
    port: 999
  },
  {
    type: "http",
    host: "95.217.120.82",
    port: 3368
  },
  {
    type: "http",
    host: "170.83.242.250",
    port: 999
  }
];

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data);
  await requestUsingProxy(data.presence_token);
  // const result = await sendOutput(submissionUrl, solution);
  // logger(`Result = ${result}`);
};

const requestUsingProxy = async (token: string) => {
  try {
    const { type, host, port } = ProxyList[0];

    const proxyOption =
      "http://80.252.5.34:7001" ?? `${type}://${host}:${port}`;
    // @ts-expect-error HttpsProxyAgent lacks the constructor signature
    const proxyAgent = new HttpsProxyAgent(proxyOption);
    logger(`Here = ${proxyOption}`);

    const response = await fetch(`${BASE_API_URL}${token}`, {
      method: "GET",
      agent: proxyAgent
    });

    const res = await response.text();
    logger(`Result = ${res}`);
  } catch (error) {
    console.error(error);
  }
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
