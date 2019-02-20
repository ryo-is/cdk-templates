import cdk = require("@aws-cdk/cdk");
// import s3 = require("@aws-cdk/aws-s3");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import dynamodb = require("@aws-cdk/aws-dynamodb");

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Lambda Function
     */
    const handler = new lambda.Function(this, "CdkLambdaDemo", {
      functionName: "CdkLambdaDemoFunction",
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.directory("resources"),
      handler: "index.demo",
      environment: {
        TZ: "Asia/Tokyo"
      }
    });

    /**
     * DynamoDB Table
     */
    const table = new dynamodb.Table(this, "CDKDemoTable", {
      tableName: "CDKDemoTable",
      partitionKey: {
        name: "ID",
        type: dynamodb.AttributeType.String
      },
      sortKey: {
        name: "record_time",
        type: dynamodb.AttributeType.String
      }
    });

    /**
     * Attach to DynamoDB Read and Write Role to Lambda
     */
    table.grantReadWriteData(handler.role);

    /**
     * APIGateway
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
  }
}
