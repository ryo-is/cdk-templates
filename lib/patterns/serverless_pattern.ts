import cdk = require("@aws-cdk/core")
import { RestApiParam, LambdaParam } from "../types"

import {
  RestApi,
  Integration,
  LambdaIntegration,
  Resource
} from "@aws-cdk/aws-apigateway"
import { Function } from "@aws-cdk/aws-lambda"

import { APIGatewayCreator } from "../services/apigateway/creator"
import { LambdaFunctionCreator } from "../services/lambda_function/creator"

export class ServerlessPattern {
  constructor(
    self: cdk.Construct,
    restApiParam: RestApiParam,
    lambdaParams: LambdaParam[]
  ) {
    const restApi: RestApi = APIGatewayCreator.createRestApi(
      self,
      restApiParam.apiName,
      restApiParam.apiDescription
    )

    lambdaParams.forEach((param: LambdaParam) => {
      const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
        self,
        param
      )
      const integration: Integration = new LambdaIntegration(lambdaFunction)
      const resource: Resource = APIGatewayCreator.addResouceToRestApi(
        restApi,
        param.path
      )

      APIGatewayCreator.addMethodToResource(resource, param.method, integration)

      if (param.cors) {
        APIGatewayCreator.addCors(resource)
      }
    })
  }
}
