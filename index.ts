import path from "path";
import debug from "debug";
import { fileURLToPath } from "url";

const logger = debug("hackattic:root");

console.log(JSON.stringify(process.argv));
const challengeName = "help-me-unpack" || String(process.argv[1]);
const challengeInputUrl = String(process.argv[2]);
const challengeSubmitUrl = String(process.argv[3]);

const runSolver = async () => {
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);
  const challengePath = path.join(
    __dirname,
    "challenges",
    challengeName,
    "index.js"
  );
  let challengeInstance = null;
  try {
    challengeInstance = await import(challengePath);
  } catch (error) {
    logger("Cannot import challenge ", error.message);
    return error;
  }

  await challengeInstance.solver(challengeInputUrl, challengeSubmitUrl);
};

runSolver();
