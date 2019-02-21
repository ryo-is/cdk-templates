import cdk = require("@aws-cdk/cdk");
import lambda = require("@aws-cdk/aws-lambda");

/**
 * Create Lambda Function
 * @param self
 * @param functionName
 * @param handler
 */
export function CreateLambdaFunction(self: cdk.Construct, functionName: string, handler: string) {
  return new lambda.Function(self, functionName, {
    functionName: functionName,
    runtime: lambda.Runtime.NodeJS810,
    code: lambda.Code.directory("resources"),
    handler: handler,
    environment: {
      TZ: "Asia/Tokyo"
    }
  })
}
