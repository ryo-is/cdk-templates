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

    const integration: apigateway.Integration = new apigateway.LambdaIntegration(lambdaFunction)
    const resourceApi: apigateway.Resource = apiGateway.root.addResource("postImage")
    resourceApi.addMethod(
      "POST",
      integration,
      {
        apiKeyRequired: false
      }
    )
    APIGatewayCreator.AddOptions(resourceApi)
  }
}
