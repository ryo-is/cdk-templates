const dayjs = require("dayjs");

function getNowDate() {
  console.log("getNowDate");
  return dayjs().format("YYYY/MM/DD HH:mm:ss");
}

module.exports = getNowDate;
