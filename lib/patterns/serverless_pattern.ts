import cdk = require("@aws-cdk/core")
import { RestApiParam, LambdaParam, RestApiResouseParam } from "../types"

import {
  RestApi,
  Integration,
  LambdaIntegration,
  Resource,
  MethodOptions,
  CfnAuthorizer,
  AuthorizationType
} from "@aws-cdk/aws-apigateway"
import { Function } from "@aws-cdk/aws-lambda"

import { APIGatewayCreator } from "../services/apigateway/creator"
import { LambdaFunctionCreator } from "../services/lambda_function/creator"

export class ServerlessPattern {
  constructor(
    self: cdk.Construct,
    restApiParam: RestApiParam,
    restApiResouseParams: RestApiResouseParam[]
  ) {
    // Create APIGateway
    const restApi: RestApi = APIGatewayCreator.createRestApi(
      self,
      restApiParam.apiName,
      restApiParam.apiDescription
    )
    let option: MethodOptions = {}

    if (
      restApiParam.auth === "API_KEY" &&
      restApiParam.planName !== undefined
    ) {
      // Use API Key
      APIGatewayCreator.createUsagePlan(self, restApiParam.planName, restApi)
      option = {
        apiKeyRequired: true
      }
    } else if (
      restApiParam.auth === "COGNITO" &&
      restApiParam.authorizerName !== undefined &&
      restApiParam.providerArns !== undefined
    ) {
      // Use cognito authorizer
      const authorizer: CfnAuthorizer = APIGatewayCreator.createAuthorizer(
        self,
        restApiParam.authorizerName,
        restApi,
        restApiParam.providerArns
      )
      option = {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: authorizer.ref
        }
      }
    }

    restApiResouseParams.forEach((resorceParam: RestApiResouseParam) => {
      // Create resouse
      const resource: Resource = APIGatewayCreator.addResouceToRestApi(
        restApi,
        resorceParam.path
      )

      // Enable cors option
      if (resorceParam.cors) {
        APIGatewayCreator.addCors(resource)
      }

      resorceParam.lambdaParams.forEach((lambdaParam: LambdaParam) => {
        // Create lambda function
        const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
          self,
          lambdaParam
        )
        // Create integration
        const integration: Integration = new LambdaIntegration(lambdaFunction)

        // Add method to resource
        APIGatewayCreator.addMethodToResource(
          resource,
          lambdaParam.method,
          integration,
          option
        )
      })
    })
  }
}
