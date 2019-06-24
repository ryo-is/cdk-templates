import cdk = require("@aws-cdk/cdk")
import apigateway = require("@aws-cdk/aws-apigateway")
import lambda = require("@aws-cdk/aws-lambda")
import dynamodb = require("@aws-cdk/aws-dynamodb")
import iam = require("@aws-cdk/aws-iam")

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { APIGatewayCreator } from "../services/apigateway/creator"
import { DynamoDBCreator } from "../services/dynamodb/creator"
import { IAMCreator } from "../services/iam/creator"

export class PythonLambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: lambda.Function = LambdaFunctionCreator.CreatePythonRuntimeLambdaFunction(this, "CdkPythonLambda", "index.handler")
    // const lambdaFunctionImport: lambda.IFunction = lambda.Function.import(this, "PostLambda", {
    //   functionArn: "arn:aws:lambda:ap-northeast-1:795622185554:function:CdkPythonLambda"
    // })
    const apiGateway: apigateway.RestApi = APIGatewayCreator.CreateApiGateway(this, "CdkADeployedPI", "AWS-CDKでデプロイしたAPIGateway")

    const apiKey: apigateway.ApiKey = new apigateway.ApiKey(this, "CDKApiKey", {
      enabled: true
    })
    new apigateway.UsagePlan(this, "CDKUsagePlan", {
      throttle: {
        burstLimit: 5000,
        rateLimit: 10000
      },
      apiStages: [{
        api: apiGateway,
        stage: apiGateway.deploymentStage
      }],
      apiKey: apiKey
    })
    // new apigateway.CfnUsagePlanKey(this, "CDKUsagePlanKey", {
    //   keyId: apiKey.keyId,
    //   keyType: "API_KEY",
    //   usagePlanId: usagePlan.usagePlanId
    // })

    const integration: apigateway.Integration = new apigateway.LambdaIntegration(lambdaFunction)
    const postIntegration: apigateway.Integration = new apigateway.LambdaIntegration(lambdaFunction)
    const getResourceApi: apigateway.Resource = apiGateway.root.addResource("getReq")
    getResourceApi.addMethod("GET", integration, {
      apiKeyRequired: false,
    })
    APIGatewayCreator.AddOptions(getResourceApi)

    const postResourceApi: apigateway.Resource = apiGateway.root.addResource("postReq")
    postResourceApi.addMethod("POST", postIntegration, {
      apiKeyRequired: true,
    })
    APIGatewayCreator.AddOptions(postResourceApi)

    const tableParams: dynamodb.TableProps[] = [
      {
        tableName: "CDKPythonLambdaStackTable",
        partitionKey: {
          name: "ID",
          type: dynamodb.AttributeType.String
        },
        sortKey: {
          name: "record_time",
          type: dynamodb.AttributeType.String
        }
      }
    ]
    const table: dynamodb.Table = DynamoDBCreator.CreateDynamoDB(this, tableParams[0])

    const statement: iam.PolicyStatement = IAMCreator.CreateDDBReadWriteRoleStatement(table.tableArn)
    lambdaFunction.addToRolePolicy(statement)
  }
}
