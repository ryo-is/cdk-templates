import cdk = require("@aws-cdk/core")
import { Function, Runtime, Code, StartingPosition } from "@aws-cdk/aws-lambda"
import { KinesisEventSource } from "@aws-cdk/aws-lambda-event-sources"
import { Stream } from "@aws-cdk/aws-kinesis"
import { CreatingLambdaFunctionParams } from "./interfaces"

export class LambdaFunctionCreator {
  // Create Lambda Function
  public static createFunction(
    self: cdk.Construct,
    params: CreatingLambdaFunctionParams
  ): Function {
    return new Function(self, params.nameValue, {
      functionName: params.nameValue,
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset(params.codeDirectory),
      handler: params.handlerValue ? params.handlerValue : "index.handler",
      memorySize: params.memorySizeValue ? params.memorySizeValue : 128,
      timeout: cdk.Duration.seconds(
        params.timeoutValue ? params.timeoutValue : 300
      ),
      environment: params.environment ? params.environment : {},
      description: params.description ? params.description : ""
    })
  }

  // Create EventSource KinesisDataStream
  public static createStreamEventSource(
    stream: Stream,
    startingPositionValue: StartingPosition,
    batchSizeValue: number
  ): KinesisEventSource {
    return new KinesisEventSource(stream, {
      startingPosition: startingPositionValue,
      batchSize: batchSizeValue
    })
  }
}
