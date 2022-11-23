const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function (line) {
  compress(line);
});

const compress = (input) => {
  // adding terminating character
  input += "$";
  const N = input.length;
  let answer = "";
  let count = 1;
  for (let idx = 1; idx < N; idx++) {
    if (input[idx] === input[idx - 1]) {
      count += 1;
    } else {
      if (count > 2) answer += `${count}${input[idx - 1]}`;
      else {
        answer += input[idx - 1].repeat(count);
      }
      count = 1;
    }
  }

  console.log(answer);
};
