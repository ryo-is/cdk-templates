const AWS = require("aws-sdk");
const DDB = new AWS.DynamoDB.DocumentClient();
const getNowDate = require("../lib/get_now_date");

module.exports = async (event, content) => {
  try {
    console.log(event);
    const nowDate = getNowDate();
    const putParams = {
      TableName: "CDKDemoTable",
      Item: {
        ID: "demo",
        record_time: nowDate,
        value: "hoge"
      }
    }
    await DDB.put(putParams).promise();

    const scanParams = {
      TableName: "CDKDemoTable",
      Limit: 100
    }
    const scanData = await DDB.scan(scanParams).promise();
    return {
      statusCode: 200,
      headers:{ "Access-Control-Allow-Origin" : "*" },
      body: JSON.stringify({message: "SUCCESS!!!", res: scanData})
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers:{ "Access-Control-Allow-Origin" : "*" },
      body: JSON.stringify({message: "ERROR!", res: err})
    };
  }
};
