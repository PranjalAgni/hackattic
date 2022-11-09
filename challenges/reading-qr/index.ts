import debug from "debug";
import fetch from "node-fetch";
import Jimp from "jimp";
import QrCode from "qrcode-reader";
import { IData, IMessage, QrData } from "./interface";

const logger = debug("hackattic:reading-qr");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  logger(data.image_url);
  const code = await fetchAndReadQR(data.image_url);
  const message: IMessage = {
    code
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

const fetchAndReadQR = async (imageURL: string): Promise<string> => {
  const qrCode = new QrCode();
  const image = await Jimp.read(imageURL);
  return await new Promise((resolve, reject) => {
    qrCode.callback = function (error: Error, decodedQr: QrData) {
      if (error !== undefined) {
        return reject(error);
      }
      logger(`Code = ${decodedQr.result}`);
      resolve(decodedQr.result);
    };
    qrCode.decode(image.bitmap);
  });
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
