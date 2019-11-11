import cdk = require("@aws-cdk/core")

import { RestApiParam, LambdaParam } from "../types"
import { ServerlessPattern } from "../patterns/serverless_pattern"

export class RestAPIs extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const restApiParam: RestApiParam = {
      apiName: "serverlessPatternAPI",
      apiDescription: "Serverless Pattern Test"
    }

    const lambdaParams: LambdaParam[] = [
      {
        nameValue: "serverlessPatternGetFunction",
        codeDirectory: "lambdaSources/demo_function",
        method: "GET",
        path: "test",
        cors: false
      }
      // {
      //   nameValue: "serverlessPatternPostFunction",
      //   codeDirectory: "lambdaSources/demo_function",
      //   method: "POST",
      //   path: "test",
      //   cors: true
      // }
    ]

    new ServerlessPattern(this, restApiParam, lambdaParams)
  }
}
