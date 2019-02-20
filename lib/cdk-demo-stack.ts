import cdk = require("@aws-cdk/cdk");
// import s3 = require("@aws-cdk/aws-s3");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // new s3.Bucket(this, "CDKDemoBucket", {
    //   versioned: true
    // });

    const handler = new lambda.Function(this, "CdkLambdaDemo", {
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.directory("resources"),
      handler: "index.demo",
      environment: {
        TZ: "Asia/Tokyo"
      }
    });

    const api = new apigateway.RestApi(this, "CdkAPIDemo", {
      restApiName: "Cdk Demo",
      description: "AWS-CDKのデモ"
    });

    const getIntegration = new apigateway.LambdaIntegration(handler);
    api.root.addMethod("GET", getIntegration);
  }
}
