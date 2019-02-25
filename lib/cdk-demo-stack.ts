import cdk = require("@aws-cdk/cdk");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import { LambdaFunctionCreator } from "./services/lambda_function/creator";
import { DynamoDBCreator } from "./services/dynamodb/creator";
import { APIGatewayCreator } from "./services/apigateway/creator";
import { IAMCreator } from "./services/iam/creator";

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create Lambda Function
     */
    const handler = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaDemoFunction", "index.demo");
    const postDemoHandler = LambdaFunctionCreator.CreateLambdaFunction(this, "CdkLambdaPostDemoFunction", "index.postDemo");

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
     * Create IAM Policy Statement
     */
    const statement = IAMCreator.CreateDDBReadWriteRoleStatement(table.tableArn);

    /**
     * Attach role to Lambda
     */
    handler.addToRolePolicy(statement);
    postDemoHandler.addToRolePolicy(statement);

    /**
     * Create APIGateway
     */
    const demoApi = APIGatewayCreator.CreateApiGateway(this, "CdkAPIDemo", "AWS-CDKのデモ");

    /**
     * Create APIGateway Authorizer
     */
    const demoApiAuthorizer = APIGatewayCreator.CreateAuthorizer(this, "CdkAPIDemoAuthorizer", demoApi);

    /**
     * Add GET and POST method to APIGateway
     */
    APIGatewayCreator.AddMethod(demoApi, "GET", handler, demoApiAuthorizer);
    APIGatewayCreator.AddResourceAndMethod(demoApi, "demo", "GET", handler, demoApiAuthorizer);
    APIGatewayCreator.AddResourceAndMethod(demoApi, "postDemo", "POST", postDemoHandler, demoApiAuthorizer)
  }
}
