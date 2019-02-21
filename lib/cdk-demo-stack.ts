import cdk = require("@aws-cdk/cdk");
import iam = require("@aws-cdk/aws-iam");
import apigateway = require("@aws-cdk/aws-apigateway");
import dynamodb = require("@aws-cdk/aws-dynamodb");

import { CreateLambdaFunction } from "./services/lambda_function";
import { CreateDynamoDB } from "./services/dynamodb";

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = CreateLambdaFunction(this, "CdkLambdaDemoFunction", "index.demo");

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

    /**
     * Create APIGateway
     */
    const api = new apigateway.RestApi(this, "CdkAPIDemo", {
      restApiName: "Cdk Demo",
      description: "AWS-CDKのデモ"
    });

    /**
     * Add GET method to APIGateway
     */
    const getIntegration = new apigateway.LambdaIntegration(handler);
    api.root.addMethod("GET", getIntegration);

    const demo = api.root.addResource("demo");
    demo.addMethod("GET", getIntegration);

    /**
     * Active APIGateway CORS
     */
    const options = api.root.addMethod("OPTIONS", new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          "method.response.header.Access-Control-Allow-Origin": "'*'",
          "method.response.header.Access-Control-Allow-Credentials": "'false'",
          "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.Never,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      }
    }));
    const methodResource = (options as cdk.Construct).node.findChild("Resource") as apigateway.CfnMethod;
    methodResource.propertyOverrides.methodResponses = [{
      statusCode: "200",
      responseModels: {
        "application/json": "Empty"
      },
      responseParameters: {
        "method.response.header.Access-Control-Allow-Headers": true,
        "method.response.header.Access-Control-Allow-Origin": true,
        "method.response.header.Access-Control-Allow-Credentials": true,
        "method.response.header.Access-Control-Allow-Methods": true,
      }
    }];
  }
}
