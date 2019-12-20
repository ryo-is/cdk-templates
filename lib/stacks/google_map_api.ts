import cdk = require("@aws-cdk/core")

import { LambdaFunctionCreator } from "../services/lambda_function/creator"

export class GoogleMapAPIStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    LambdaFunctionCreator.createFunction(this, {
      nameValue: "google_map_api_function",
      codeDirectory: "lambdaSources/google_map_api_function",
      environment: { TZ: "Asia/Tokyo" }
    })
  }
}
