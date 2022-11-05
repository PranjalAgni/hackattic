import { createHash, createHmac, pbkdf2, scrypt } from "crypto";
import debug from "debug";
import fetch from "node-fetch";
import { IData, IPbkdf2Config, IScryptConfig } from "./interface";

const logger = debug("hackattic:password-hashing");

export const solver = async (
  problemUrl: string,
  submissionUrl: string
): Promise<void> => {
  const data: IData | null = await fetchInput(problemUrl);
  if (data === null) return;
  const { password, salt } = data;
  const decodedSalt = Buffer.from(salt, "base64");
  const sha256 = createHash("sha256").update(password).digest("hex");
  const hmacSha256 = createHmac("sha256", Buffer.from(salt, "base64"))
    .update(password)
    .digest("hex");
  const pbkdf2 = await computePbkdf2Hash(password, decodedSalt, data.pbkdf2);
  const scryptHash = await computeScryptHash(
    password,
    decodedSalt,
    data.scrypt
  );

  const solution = {
    sha256,
    hmac: hmacSha256,
    pbkdf2,
    scrypt: scryptHash
  };

  logger("%O", solution);
  const result = await sendOutput(submissionUrl, solution);
  logger(`Result = ${result}`);
};

const computePbkdf2Hash = (
  password: string,
  salt: Buffer,
  config: IPbkdf2Config
): Promise<string> => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, config.rounds, 32, config.hash, (err, hash) => {
      if (err !== null) {
        return reject(err);
      }
      resolve(hash.toString("hex"));
    });
  });
};

const computeScryptHash = (
  password: string,
  salt: Buffer,
  { N, r, p }: IScryptConfig
): Promise<string> => {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      32,
      { N, r, p, maxmem: N * 2 * r * 65 },
      (err, hash) => {
        if (err !== null) {
          return reject(err);
        }

        resolve(hash.toString("hex"));
      }
    );
  });
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
