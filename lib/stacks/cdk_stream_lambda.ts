import cdk = require("@aws-cdk/core")
import { Function, StartingPosition } from "@aws-cdk/aws-lambda"
import { KinesisEventSource } from "@aws-cdk/aws-lambda-event-sources"
import { Stream } from "@aws-cdk/aws-kinesis"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { KinesisDataStreamCreator } from "../services/kinesis/creator"

export class CdkStreamLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      "cdk_steram_demo",
      "lambdaSoruces/demo_function",
      "index.handler",
      256,
      300
    )

    const stream: Stream = KinesisDataStreamCreator.createStream(
      this,
      "cdk_stream",
      24,
      1
    )

    const streamEventSource: KinesisEventSource = LambdaFunctionCreator.createStreamEventSource(stream, StartingPosition.TRIM_HORIZON, 10)
    lambdaFunction.addEventSource(streamEventSource)
  }
}
