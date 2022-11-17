const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const weekDays = [
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday"
];

rl.on("line", function (line) {
  const dayNumber = Math.abs(parseInt(line));
  getWeekDay(dayNumber);
});

const getWeekDay = (dayNumber) => {
  console.log(weekDays[dayNumber % 7]);
};
