import cdk = require("@aws-cdk/core")
import { Function } from "@aws-cdk/aws-lambda"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { IoTCoreCreator } from "../services/iotcore/creator"

export class CdkIoTLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      "cdk_iot_demo",
      "lambdaSoruces/demo_function",
      "index.handler",
      256,
      300
    )

    const sqlBody: string = "SELECT * FROM 'CdkIoTDemo/#'" // sql for topic rule
    IoTCoreCreator.createTopicRuleInvokeLambda(this, "CDKIoTLambdaRule", lambdaFunction.functionArn, sqlBody)
  }
}
