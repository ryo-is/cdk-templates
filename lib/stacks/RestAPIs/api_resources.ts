import cdk = require("@aws-cdk/core")

import { RestApiParam, RestApiResouceParam, LambdaParam } from "../../types"
import {
  MethodOptions,
  RestApi,
  Integration,
  LambdaIntegration,
  Resource,
  CfnAuthorizer,
  AuthorizationType
} from "@aws-cdk/aws-apigateway"
import { Function } from "@aws-cdk/aws-lambda"

import { APIGatewayCreator } from "../../services/apigateway/creator"
import { LambdaFunctionCreator } from "../../services/lambda_function/creator"

export class APIResourcesStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    restApi: RestApi,
    restApiParam: RestApiParam,
    restApiResouseParams: RestApiResouceParam[],
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    let option: MethodOptions = {}
    if (
      restApiParam.auth === "API_KEY" &&
      restApiParam.planName !== undefined
    ) {
      // Use API Key
      APIGatewayCreator.createUsagePlan(this, restApiParam.planName, restApi)
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
        this,
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

    restApiResouseParams.forEach((resorceParam: RestApiResouceParam) => {
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
          this,
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
