import cdk = require("@aws-cdk/core")
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda"

export class LambdaFunctionCreator {
  // Create Lambda Function
  public static createFunction(
    self: cdk.Construct,
    name: string,
    codeDirectory: string,
    handlerName: string
  ): Function {
    return new Function(self, name, {
      functionName: name,
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset(codeDirectory),
      handler: handlerName,
      memorySize: 256,
      timeout: cdk.Duration.seconds(300),
      environment: {
        TZ: "Asia/Tokyo"
      }
    })
  }
}
