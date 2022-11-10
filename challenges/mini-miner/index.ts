import debug from "debug";
import fetch from "node-fetch";
import { createHash } from "crypto";
import { IBlock, IData, IMessage } from "./interface";

const logger = debug("hackattic:mini-miner");

const hexVsBinaryMap: { [key: number]: number } = {
  0: 4,
  1: 3,
  2: 2,
  3: 2,
  4: 1,
  5: 1,
  6: 1,
  7: 1
};

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger("%O", data);
  const nonce = performMining(data.difficulty, data.block);
  logger(`Nonce value is ${nonce}`);
  const solution: IMessage = {
    nonce
  };
  const result = await sendOutput(submissionUrl, solution);
  logger(`Result = ${result}`);
};

const checkIfHashIsGood = (hash: string, difficulty: number) => {
  let idx = 0;
  let digit = parseInt(hash[idx]);
  let zeroBits = 0;
  while (!isNaN(digit)) {
    zeroBits += hexVsBinaryMap[digit];
    if (digit > 0) break;
    idx += 1;
    digit = parseInt(hash[idx]);
  }

  return zeroBits >= difficulty;
};

const performMining = (difficulty: number, block: IBlock) => {
  let nonce = 0;
  let check = true;

  while (check) {
    // crafted blockchain block to hash
    const modifiedBlock = {
      data: block.data,
      nonce
    };
    const hash = createHash("sha256").update(JSON.stringify(modifiedBlock));
    // We digest the hash in hex
    const digestHex = hash.digest("hex");

    if (checkIfHashIsGood(digestHex, difficulty)) {
      check = false;
    } else {
      nonce += 1;
    }
  }

  return nonce;
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
  message: IMessage
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
