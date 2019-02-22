import cdk = require("@aws-cdk/cdk");
import iam = require("@aws-cdk/aws-iam");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import { CreateLambdaFunction } from "./services/lambda_function/creator";
import { CreateDynamoDB } from "./services/dynamodb/creator";
import { CreateApiGateway, AddMethod, AddResourceAndMethod } from "./services/apigateway/creator";

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = CreateLambdaFunction(this, "CdkLambdaDemoFunction", "index.demo");
    const postDemoHandler = CreateLambdaFunction(this, "CdkLambdaPostDemoFunction", "index.postDemo");

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
    const table = CreateDynamoDB(this, tableParams[0]);

    /**
     * Create IAM Policy Statement
     */
    const statement = new iam.PolicyStatement().allow()
                      .addActions(
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                        "dynamodb:Query",
                        "dynamodb:Scan"
                      )
                      .addResource(
                        table.tableArn
                      );

    /**
     * Attach role to Lambda
     */
    handler.addToRolePolicy(statement);
    postDemoHandler.addToRolePolicy(statement);

    /**
     * Create APIGateway
     */
    const demoApi = CreateApiGateway(this, "CdkAPIDemo", "AWS-CDKのデモ");

    /**
     * Add GET and POST method to APIGateway
     */
    AddMethod(demoApi, "GET", handler);
    AddResourceAndMethod(demoApi, "demo", "GET", handler);
    AddResourceAndMethod(demoApi, "postDemo", "POST", postDemoHandler)
  }
}
