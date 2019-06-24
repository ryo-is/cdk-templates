import cdk = require("@aws-cdk/cdk")
import lambda = require("@aws-cdk/aws-lambda")
import dynamodb = require("@aws-cdk/aws-dynamodb")
import iam = require("@aws-cdk/aws-iam")
import apigateway = require("@aws-cdk/aws-apigateway")

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { DynamoDBCreator } from "../services/dynamodb/creator"
import { S3Creator } from "../services/s3/creator"
import { APIGatewayCreator } from "../services/apigateway/creator"
import { IAMCreator } from "../services/iam/creator"
import { KinesisStreamsCreator } from "../services/kinesis/creator"

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    /**
     * Create Lambda Function
     */
    const getHandler: lambda.Function = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaGetFunction", "index.get", "")
    const postHandler: lambda.Function = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaPostFunction", "index.post", "")

    /**
     * Create DynamoDB Table
     */
    const tableParams: dynamodb.TableProps[] = [
      {
        tableName: "CDKDemoTable",
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

    /**
     * Create S3 bucket
     */
    S3Creator.CreateS3Bucket(this, "cdk-stack-bucket")

    /**
     * Create KinesisStreams
     */
    KinesisStreamsCreator.CreateKinesisStream(this, "CdkKinesisStream", 1)

    /**
     * Create IAM Policy Statement
     */
    const statement: iam.PolicyStatement = IAMCreator.CreateDDBReadWriteRoleStatement(table.tableArn)

    /**
     * Attach role to Lambda
     */
    getHandler.addToRolePolicy(statement)
    postHandler.addToRolePolicy(statement)

    /**
     * Create APIGateway
     */
    const api: apigateway.RestApi = APIGatewayCreator.CreateApiGateway(this, "CdkADeployedPI", "AWS-CDKでデプロイしたAPIGateway")

    /**
     * Create APIGateway Authorizer
     */
    const apiAuthorizer: apigateway.CfnAuthorizer = APIGatewayCreator.CreateAuthorizer(this, "CdkAPIAuthorizer", api)
    /**
     * Add GET and POST method to APIGateway
     */
    APIGatewayCreator.AddMethod(api, "GET", getHandler, apiAuthorizer)
    APIGatewayCreator.AddResourceAndMethod(api, "get", "GET", getHandler, apiAuthorizer)
    APIGatewayCreator.AddResourceAndMethod(api, "post", "POST", postHandler, apiAuthorizer)


    new apigateway.Method(this, id, {
      resource: api.root,
      httpMethod: "GET"
    })
  }
}
