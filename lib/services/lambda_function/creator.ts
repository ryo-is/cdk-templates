import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");

export class LambdaFunctionCreator {
  /**
   * Create Lambda Function
   * @param {cdk.Construct} self
   * @param {String} functionName
   * @param {String} handler
   */
  static CreateLambdaFunction(self: cdk.Construct, functionName: string, handler: string) {
    return new lambda.Function(self, functionName, {
      functionName: functionName,
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.directory("resources"),
      handler: handler,
      environment: {
        TZ: "Asia/Tokyo"
      }
    });
  }
}
