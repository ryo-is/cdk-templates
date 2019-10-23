import cdk = require("@aws-cdk/core")
import { Function } from "@aws-cdk/aws-lambda"
import {
  RestApi,
  Integration,
  LambdaIntegration,
  Resource,
  CfnAuthorizer,
  MethodOptions,
  AuthorizationType
} from "@aws-cdk/aws-apigateway"
import { PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { APIGatewayCreator } from "../services/apigateway/creator"
import { IAMCreator } from "../services/iam/creator"

export class LambdaAuthorizer extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const authorizerFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      {
        nameValue: "authorizer_function",
        codeDirectory: "lambdaSources/authorizer_function",
        memorySizeValue: 128
      }
    )

    const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      {
        nameValue: "cdk_demo_function",
        codeDirectory: "lambdaSources/demo_function",
        memorySizeValue: 256
      }
    )

    const invokeLambdaRoleStatement: PolicyStatement = IAMCreator.createRoleStatement(
      ["lambda:InvokeFunction"],
      [authorizerFunction.functionArn]
    )
    const invokeLambdaRole: Role = new Role(this, "invokeFunctionRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
    })
    invokeLambdaRole.addToPolicy(invokeLambdaRoleStatement)

    const restApi: RestApi = APIGatewayCreator.createRestApi(
      this,
      "CdkDemoAPI",
      "Deployed by CDK"
    )

    const integration: Integration = new LambdaIntegration(lambdaFunction)
    const getResouse: Resource = APIGatewayCreator.addResouceToRestApi(
      restApi,
      "get"
    )

    const authorizer: CfnAuthorizer = new CfnAuthorizer(
      this,
      "lambda_authorizer",
      {
        restApiId: restApi.restApiId,
        name: "lambda_authorizer",
        identitySource: "method.request.header.Authorization",
        type: "REQUEST",
        authorizerCredentials: invokeLambdaRole.roleArn,
        authorizerUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${authorizerFunction.functionArn}/invocations`
      }
    )
    const option: MethodOptions = {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer: {
        authorizerId: authorizer.ref
      }
    }

    APIGatewayCreator.addMethodToResource(
      getResouse,
      "GET",
      integration,
      option
    )
    APIGatewayCreator.addCors(getResouse)
  }
}
