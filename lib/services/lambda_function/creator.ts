import cdk = require("@aws-cdk/core")
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda"

export class LambdaFunctionCreator {
  /**
   * Create Lambda Function
   * @param {cdk.Construct} self
   * @param {String} functionName
   * @param {String} handler
   * @param {String} codeDirectory
   */
  static createFunction(
    self: cdk.Construct,
    functionName: string,
    codeDirectory: string,
    handler: string
  ) {
    return new Function(self, functionName, {
      functionName: functionName,
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset(codeDirectory),
      handler: handler,
      memorySize: 256,
      timeout: cdk.Duration.seconds(300),
      environment: {
        TZ: "Asia/Tokyo"
      }
    })
  }
}
