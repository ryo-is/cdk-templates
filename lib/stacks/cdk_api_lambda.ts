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
      "lambdaSources/demo_function",
      "index.handler",
      256,
      300
    )

    const restApi: RestApi = APIGatewayCreator.createRestApi(this, "CdkDemoAPI", "Deployed by CDK")

    const integration: Integration = new LambdaIntegration(lambdaFunction)
    const getResouse: Resource = APIGatewayCreator.addResouceToRestApi(restApi, "get")

    // Use API Key
    // APIGatewayCreator.createUsagePlan(this, "CDKUsagePlan", restApi)
    // const options: MethodOptions = {
    //   apiKeyRequired: true
    // }
    // APIGatewayCreator.addMethodToResource(getResouse, "GET", integration, options)

    // Use Authorizer
    // const authorizer: CfnAuthorizer = APIGatewayCreator.createAuthorizer(this, "CDKAuthorizer", restApi)
    // const option: MethodOptions = {
    //   authorizationType: AuthorizationType.COGNITO,
    //   authorizer: {
    //     authorizerId: authorizer.ref
    //   }
    // }

    APIGatewayCreator.addMethodToResource(getResouse, "GET", integration)
    APIGatewayCreator.addOptions(getResouse)
  }
}
