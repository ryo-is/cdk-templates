import cdk = require("@aws-cdk/cdk");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
// import dynamodb = require("@aws-cdk/aws-dynamodb");
// import iam = require("@aws-cdk/aws-iam");

import { LambdaFunctionCreator } from "../services/lambda_function/creator";
import { APIGatewayCreator } from "../services/apigateway/creator";
// import { DynamoDBCreator } from "../services/dynamodb/creator";
// import { IAMCreator } from "../services/iam/creator";

export class PythonLambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction: lambda.Function = LambdaFunctionCreator.CreatePythonRuntimeLambdaFunction(this, "CdkPythonLambda", "index.handler")
    const apiGateway: apigateway.RestApi = APIGatewayCreator.CreateApiGateway(this, "CdkADeployedPI", "AWS-CDKでデプロイしたAPIGateway")

    const integration: apigateway.Integration = new apigateway.LambdaIntegration(lambdaFunction)
    const getResourceApi: apigateway.Resource = apiGateway.root.addResource("get")
    getResourceApi.addMethod("GET", integration)
    APIGatewayCreator.AddOptions(getResourceApi)

    const postResourceApi: apigateway.Resource = apiGateway.root.addResource("post")
    postResourceApi.addMethod("POST", integration)
    APIGatewayCreator.AddOptions(postResourceApi)

    // const tableParams: dynamodb.TableProps[] = [
    //   {
    //     tableName: "CDKPythonLambdaStackTable",
    //     partitionKey: {
    //       name: "ID",
    //       type: dynamodb.AttributeType.String
    //     },
    //     sortKey: {
    //       name: "record_time",
    //       type: dynamodb.AttributeType.String
    //     }
    //   }
    // ];
    // const table: dynamodb.Table = DynamoDBCreator.CreateDynamoDB(this, tableParams[0]);

    // const statement: iam.PolicyStatement = IAMCreator.CreateDDBReadWriteRoleStatement(table.tableArn);
    // lambdaFunction.addToRolePolicy(statement);
  }
}
