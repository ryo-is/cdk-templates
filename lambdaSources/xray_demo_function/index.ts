import { Handler } from "aws-lambda"
import { express, captureAWS, captureFunc } from "aws-xray-sdk"
import * as aws from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
const AWS: any = captureAWS(aws)
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

    const queryParam_2: DocumentClient.QueryInput = {
      TableName: "iot-kyoto-data",
      KeyConditionExpression: "#ID = :id",
      ExpressionAttributeNames: {
        "#ID": "ID"
      },
      ExpressionAttributeValues: {
        ":id": "id001"
      },
      Limit: 100
    }
    const data_2 = await DDB.query(queryParam_2).promise()
    console.log(data_2)

    express.openSegment("segment")
    captureFunc("captureFunc", function() {
      console.log("capture")
    })
    express.closeSegment()
  } catch (err) {
    console.error(err)
    throw err
  }
}
