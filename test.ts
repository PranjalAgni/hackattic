/* eslint-disable no-console */
async function resolveAfter2Seconds(): Promise<string> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
}

async function asyncCall(): Promise<void> {
  const someList: number[] = [1, 2, 3];
  const someObject = {
    a: 1,
    b: 2,
  };

  const { a, b } = someObject;
  console.log("calling ", someList, someObject, a, b);
  const result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: "resolved"
}

asyncCall().then(console.log).catch(console.error);
