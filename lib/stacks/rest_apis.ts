import cdk = require("@aws-cdk/core")

import { RestApiParam, RestApiResouseParam } from "../types"
import { ServerlessPattern } from "../patterns/serverless_pattern"

export class RestAPIs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const restApiParam: RestApiParam = {
      apiName: "serverlessPatternAPI",
      apiDescription: "Serverless Pattern Test"
    }

    const restApiResouseParams: RestApiResouseParam[] = [
      {
        path: "test",
        cors: true,
        lambdaParams: [
          {
            nameValue: "serverlessPatternGetFunction",
            codeDirectory: "lambdaSources/demo_function",
            method: "GET"
          },
          {
            nameValue: "serverlessPatternPostFunction",
            codeDirectory: "lambdaSources/demo_function",
            method: "POST"
          }
        ]
      }
    ]

    new ServerlessPattern(this, restApiParam, restApiResouseParams)
  }
}
