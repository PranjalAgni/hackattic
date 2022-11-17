const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const inputList = [];

rl.on("line", function (line) {
  inputList.push(line);
});

rl.once("close", function () {
  solve(inputList);
});

const solve = (inputList) => {
  const sanatizedList = preprocessList(inputList);
  const sortedJsonList = sanatizedList.sort(sortJsonListComparator);
  sortedJsonList.forEach((object) => {
    console.log(`${object.name}: ${object.balance.toLocaleString("en-us")}`);
  });
};

const preprocessList = (inputList) => {
  const sanatizedList = inputList.map((input) => {
    const inputJson = JSON.parse(input);
    const [name] = Object.keys(inputJson);
    const isExtraPresent = "extra" in inputJson;
    return {
      name,
      balance: isExtraPresent
        ? inputJson.extra.balance
        : inputJson[name].balance
    };
  });

  return sanatizedList;
};

const sortJsonListComparator = (objectA, objectB) => {
  return objectA.balance - objectB.balance;
};
