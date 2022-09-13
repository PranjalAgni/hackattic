/* eslint-disable no-console */
async function resolveAfter2Seconds(): Promise<string> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}

async function asyncCall(): Promise<void> {
  console.log("calling");
  const result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: "resolved"
}

asyncCall().then(console.log).catch(console.error);
