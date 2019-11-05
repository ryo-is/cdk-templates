import cdk = require("@aws-cdk/core")
import { Function } from "@aws-cdk/aws-lambda"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { PolicyStatement } from "@aws-cdk/aws-iam"
import { IAMCreator } from "../services/iam/creator"

export class CalendarAPIStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambda: Function = LambdaFunctionCreator.createFunction(this, {
      nameValue: "calendar_api_function",
      codeDirectory: "lambdaSources/calendar_api_function",
      environment: { TZ: "Asia/Tokyo" }
    })
    const policyStatement: PolicyStatement = IAMCreator.createRoleStatement(
      ["dynamodb:PutItem"],
      ["arn:aws:dynamodb:ap-northeast-1:*:table/VisitorManagement"]
    )
    lambda.addToRolePolicy(policyStatement)
  }
}