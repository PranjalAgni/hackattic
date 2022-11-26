const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function (line) {
  const binaryString = parseInput(line);
  const number = parseInt(binaryString, 2);
  console.log(number);
});

const parseInput = (line) => {
  let binaryString = "";
  const N = line.length;
  for (let idx = 0; idx < N; idx++) {
    if (line[idx] === "#") binaryString += "1";
    else binaryString += "0";
  }
  return binaryString;
};
