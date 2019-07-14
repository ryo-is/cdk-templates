import cdk = require("@aws-cdk/core")
import { Function, Runtime, Code, StartingPosition } from "@aws-cdk/aws-lambda"
import { KinesisEventSource } from "@aws-cdk/aws-lambda-event-sources"
import { Stream } from "@aws-cdk/aws-kinesis"

export class LambdaFunctionCreator {
  // Create Lambda Function
  public static createFunction(
    self: cdk.Construct,
    nameValue: string,
    codeDirectory: string,
    handlerValue: string,
    memorySizeValue: number,
    timeoutValue: number,
    environmentValue: {[k: string]: any} = {}
  ): Function {
    return new Function(self, nameValue, {
      functionName: nameValue,
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset(codeDirectory),
      handler: handlerValue,
      memorySize: memorySizeValue,
      timeout: cdk.Duration.seconds(timeoutValue),
      environment: environmentValue
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
