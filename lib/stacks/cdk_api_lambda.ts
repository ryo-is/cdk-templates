import cdk = require("@aws-cdk/core")
import { Function } from "@aws-cdk/aws-lambda"
import {
  RestApi,
  Integration,
  LambdaIntegration,
  Resource
 } from "@aws-cdk/aws-apigateway"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { APIGatewayCreator } from "../services/apigateway/creator"

export class CdkAPILambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      "cdk_demo",
      "lambdaSoruces/demo_function",
      "index.handler"
    )

    const restApi: RestApi = APIGatewayCreator.createRestApi(this, "CdkDemoAPI", "Deployed by CDK")

    const integration: Integration = new LambdaIntegration(lambdaFunction)
    const getResouse: Resource = APIGatewayCreator.addResouceToRestApi(restApi, "get")
    APIGatewayCreator.addMethodToResource(getResouse, "GET", integration)
    APIGatewayCreator.addOptions(getResouse)
  }
}
