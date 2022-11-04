import path from "path";
import debug from "debug";

const logger = debug("hackattic:root");

const challengeName = String(process.argv[2]);
const challengeInputUrl = String(process.argv[3]);
const challengeSubmitUrl = String(process.argv[4]);

const runSolver = async (): Promise<void> => {
  const challengePath = path.join(__dirname, "challenges", challengeName);
  let challengeInstance = null;
  try {
    challengeInstance = await import(challengePath);
  } catch (error) {
    logger("Cannot import challenge ", error.message);
    return error;
  }

  await challengeInstance.solver(challengeInputUrl, challengeSubmitUrl);
};

(async function () {
  await runSolver();
})();
