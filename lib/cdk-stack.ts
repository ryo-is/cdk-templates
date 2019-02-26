import cdk = require("@aws-cdk/cdk");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import { LambdaFunctionCreator } from "./services/lambda_function/creator";
import { DynamoDBCreator } from "./services/dynamodb/creator";
import { S3Creator } from "./services/s3/creator";
import { APIGatewayCreator } from "./services/apigateway/creator";
import { IAMCreator } from "./services/iam/creator";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create Lambda Function
     */
    const getHandler = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaGetFunction", "index.get");
    const postHandler = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaPostFunction", "index.post");

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
    ];
    const table = DynamoDBCreator.CreateDynamoDB(this, tableParams[0]);

    /**
     * Create S3 bucket
     */
    S3Creator.CreateS3Bucket(this, "cdk-stack-bucket");

    /**
     * Create IAM Policy Statement
     */
    const statement = IAMCreator.CreateDDBReadWriteRoleStatement(table.tableArn);

    /**
     * Attach role to Lambda
     */
    getHandler.addToRolePolicy(statement);
    postHandler.addToRolePolicy(statement);

    /**
     * Create APIGateway
     */
    const api = APIGatewayCreator.CreateApiGateway(this, "CdkADeployedPI", "AWS-CDKでデプロイしたAPIGateway");

    /**
     * Create APIGateway Authorizer
     */
    const apiAuthorizer = APIGatewayCreator.CreateAuthorizer(this, "CdkAPIAuthorizer", api);

    /**
     * Add GET and POST method to APIGateway
     */
    APIGatewayCreator.AddMethod(api, "GET", getHandler, apiAuthorizer);
    APIGatewayCreator.AddResourceAndMethod(api, "get", "GET", getHandler, apiAuthorizer);
    APIGatewayCreator.AddResourceAndMethod(api, "post", "POST", postHandler, apiAuthorizer);
  }
}
