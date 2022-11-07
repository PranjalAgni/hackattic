import debug from "debug";
import fetch from "node-fetch";
import WebSocket from "ws";
import { IData } from "./interface";

const logger = debug("hackattic:websocket-chit-chat");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger(data.token);
  const answer = await websocketChat(data.token);
  const message = {
    secret: answer
  };
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

const getEstimatedTime = (endTime: number, timeList: number[]) => {
  const intervalBuckets = [700, 1500, 2000, 2500, 3000];
  logger(`Length of timelist = ${timeList.length}`);
  let difference = Number.MAX_SAFE_INTEGER;
  let correctInterval = null;

  for (const time of timeList) {
    const estimatedTime = Math.abs(endTime - time);
    for (let idx = 0; idx < 5; idx++) {
      const interval = intervalBuckets[idx];
      const diff = Math.abs(interval - estimatedTime);
      if (diff < difference) {
        difference = diff;
        correctInterval = interval;
        if (difference === 0) break;
      }
    }
  }

  return correctInterval;
};

const websocketChat = (token: string) => {
  return new Promise((resolve) => {
    const wss = new WebSocket(`wss://hackattic.com/_/ws/${token}`);
    let startTime: Date | null = null;
    const timeList: number[] = [];
    let isSolved = false;
    let answer: string | null = null;
    wss.on("open", () => {
      startTime = new Date();
      timeList.push(Number(startTime));
      logger("Connected to the hackattic server");
    });

    wss.on("message", function (data: string) {
      if (startTime === null) return;
      const endTime = Number(new Date());
      const result = getEstimatedTime(endTime, timeList);
      timeList.push(endTime);
      const message = data.toString();
      logger(message);
      logger("Result time1 = ", result);
      if (message.includes("ping!")) {
        wss.send(result);
      }

      if (message.includes("congratulations!")) {
        isSolved = true;
        answer = message.split('"')[1];
        wss.close();
      }
    });

    wss.on("close", () => {
      if (isSolved) {
        logger("Answer is ", answer);
        resolve(answer);
      } else {
        logger("***** CONNECTION Terminated *****");
        websocketChat(token);
      }
    });

    // return answer;
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
