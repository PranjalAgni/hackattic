const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function (line) {
  const input = line;
  convertToSnakeCase(input);
});

const types = [
  "u32",
  "fn",
  "dw",
  "u64",
  "p",
  "d",
  "f",
  "w",
  "b",
  "ch",
  "i32",
  "i16",
  "i64"
];

const convertToSnakeCase = (input) => {
  const N = input.length;
  let start = 0;
  let chunk = "";
  const snakeCaseList = [];

  for (let idx = start; idx < N; idx++) {
    const ch = input[idx];
    if (ch >= "A" && ch <= "W") {
      if (chunk) snakeCaseList.push(chunk.toLowerCase());
      chunk = "";
    }
    chunk += ch;
  }

  if (chunk) snakeCaseList.push(chunk.toLowerCase());
  for (const type of types) {
    if (snakeCaseList[0].startsWith(type)) {
      snakeCaseList.shift();
      break;
    }
  }
  console.log(snakeCaseList.join("_"));
};
