import { Handler } from "aws-lambda"
import * as awsXRay from "aws-xray-sdk"
import * as aws from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
const AWS: any = awsXRay.captureAWS(aws)
const DDB = new AWS.DynamoDB.DocumentClient({
  region: "ap-northeast-1"
}) as DocumentClient

export const handler: Handler = async (): Promise<void> => {
  try {
    const queryParam: DocumentClient.QueryInput = {
      TableName: "iot-kyoto-data",
      KeyConditionExpression: "#ID = :id",
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
  } catch (err) {
    console.error(err)
  }
}
