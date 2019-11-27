import cdk = require("@aws-cdk/core")

import { RestApiParam, RestApiResouseParam } from "../../types"
import { ServerlessPattern } from "../../patterns/serverless_pattern"

import lambdaParamsJson from "./parameters/lambdaParams.json"

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
        lambdaParams: lambdaParamsJson
      }
    ]

    new ServerlessPattern(this, restApiParam, restApiResouseParams)
  }
}
