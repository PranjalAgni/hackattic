// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const sleep = async (delay: number) => {
  // eslint-disable-next-line @typescript-eslint/return-await
  return new Promise((resolve) => {
    console.log("Waiting...");
    setTimeout(() => {
      resolve("Hey I slept");
    }, delay);
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const main = async () => {
  console.log("Started running");
  const something = sleep(2000);
  console.log(something);
  console.log("Done");
};

main();
