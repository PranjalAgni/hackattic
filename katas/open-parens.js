const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function (line) {
  const isBalanced = isBracketsBalanced(line);
  console.log(isBalanced ? "yes" : "no");
});

const isBracketsBalanced = (brackets) => {
  const stack = [];
  for (const char of brackets) {
    if (char === "(") stack.push(char);
    else {
      const N = stack.length;
      if (N === 0 || stack[N - 1] !== "(") return false;
      stack.pop();
    }
  }

  return stack.length === 0;
};
