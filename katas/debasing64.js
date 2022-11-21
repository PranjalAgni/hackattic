const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function (line) {
  decodeBase64(line);
});

const decodeBase64 = (base64Str) => {
  const buf = Buffer.from(base64Str, "base64");
  console.log(buf.toString());
};
