import { Handler } from "aws-lambda"
import * as xray from "aws-xray-sdk"
import { DynamoDB } from "aws-sdk"
const client = new DynamoDB.DocumentClient()
const DDB = xray.captureAWSClient(
  (client as any).service
) as DynamoDB.DocumentClient

export const handler: Handler = async (): Promise<void> => {
  const queryParam: DynamoDB.DocumentClient.QueryInput = {
    TableName: "iot-kyoto-data",
    KeyConditionExpression: "#ID = :ID",
    ExpressionAttributeNames: {
      "#ID": "ID"
    },
    ExpressionAttributeValues: {
      ":id": "id001"
    },
    Limit: 1
  }
  const data = await DDB.query(queryParam).promise()
  console.log(data)
}
