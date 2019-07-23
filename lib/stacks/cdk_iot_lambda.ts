import cdk = require("@aws-cdk/core")
import { Function } from "@aws-cdk/aws-lambda"
import { ServicePrincipal } from "@aws-cdk/aws-iam"

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { IoTCoreCreator } from "../services/iotcore/creator"

export class CdkIoTLambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: Function = LambdaFunctionCreator.createFunction(
      this,
      "cdk_iot_demo",
      "lambdaSources/demo_function",
      "index.handler",
      256,
      300
    )

    lambdaFunction.addPermission("CDKLambdaPermission", {
      principal: new ServicePrincipal("iot.amazonaws.com")
    })

    const sqlBody: string = "SELECT * FROM 'CdkIoTDemo/#'" // sql for topic rule
    IoTCoreCreator.createTopicRuleInvokeLambda(this, "CDKIoTLambdaRule", lambdaFunction.functionArn, sqlBody)
  }
}
