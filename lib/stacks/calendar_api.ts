import cdk = require("@aws-cdk/core")
// import { Function } from "@aws-cdk/aws-lambda"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"

export class CalendarAPIStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    LambdaFunctionCreator.createFunction(this, {
      nameValue: "calendar_api_function",
      codeDirectory: "lambdaSources/calendar_api_function",
      environment: { TZ: "Asia/Tokyo" }
    })
  }
}
