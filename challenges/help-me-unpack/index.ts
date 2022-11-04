import debug from "debug";
import fetch from "node-fetch";
import { IBytes, IMessage } from "./interface";
import { Buffer } from "buffer";

const logger = debug("hackattic:help-me-unpack");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data = await fetchInput(problemUrl);
  if (data === null) return;
  const { bytes } = data;
  const byteStream = Buffer.from(bytes, "base64");
  const message = unpackBytes(byteStream);
  logger(`Extract asked values from base64 bytes ${JSON.stringify(message)}`);
  const result = await sendOutput(submissionUrl, message);
  logger(`Result = ${result}`);
};

const unpackBytes = (byteStream: any): IMessage => {
  const message = {
    int: byteStream.readInt32LE(0, 4),
    uint: byteStream.readUInt32LE(4, 8),
    short: byteStream.readInt16LE(8, 10),
    float: byteStream.readFloatLE(12, 16),
    double: byteStream.readDoubleLE(16, 24),
    big_endian_double: byteStream.readDoubleBE(24)
  };

  return message;
};

const fetchInput = async (problemUrl: string): Promise<IBytes | null> => {
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
