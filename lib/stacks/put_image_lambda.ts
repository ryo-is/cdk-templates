import cdk = require("@aws-cdk/cdk")
import apigateway = require("@aws-cdk/aws-apigateway")
import lambda = require("@aws-cdk/aws-lambda")

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { APIGatewayCreator } from "../services/apigateway/creator"

export class PutImageLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: lambda.Function = LambdaFunctionCreator.CreateLambdaFunction(
      this,
      "put_image_to_s3",
      "lambda-src/put_iamge_to_s3",
      "index.handler"
    )

    const apiGateway: apigateway.RestApi = APIGatewayCreator.CreateApiGateway(
      this,
      "PutImageToS3API",
      "画像をS3にputするAPI"
    )

    const usagePlan: apigateway.CfnUsagePlan = new apigateway.CfnUsagePlan(this, "PutImageToS3APIUsagePlan", {
      throttle: {
        burstLimit: 5000,
        rateLimit: 10000
      },
      apiStages: [{
        apiId: apiGateway.restApiId,
        stage: (apiGateway.deploymentStage as apigateway.Stage).stageName
      }]
    })
    const apiKey: apigateway.CfnApiKey = new apigateway.CfnApiKey(this, "PutImageToS3APIKey", {
      enabled: true
    })
    new apigateway.CfnUsagePlanKey(this, "PutImageToS3APIUsagePlanKey", {
      keyId: apiKey.apiKeyId,
      keyType: "API_KEY",
      usagePlanId: usagePlan.usagePlanId
    })

    const integration: apigateway.Integration = new apigateway.LambdaIntegration(lambdaFunction)
    const resourceApi: apigateway.Resource = apiGateway.root.addResource("postImage")
    resourceApi.addMethod(
      "POST",
      integration,
      {
        apiKeyRequired: true
      }
    )
    APIGatewayCreator.AddOptions(resourceApi)
  }
}
