import cdk = require("@aws-cdk/core")
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs"
import { Tracing } from "@aws-cdk/aws-lambda"
import { IAMCreator } from "../services/iam/creator"

export class XRayDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambda = new NodejsFunction(this, "NodejsFunction", {
      entry: "lambdaSources/xray_demo_function/index.ts",
      handler: "handler",
      minify: true,
      tracing: Tracing.ACTIVE
    })

    const policyStatement = IAMCreator.createRoleStatement(
      ["dynamodb:Query"],
      ["arn:aws:dynamodb:ap-northeast-1:*:table/iot-kyoto-data"]
    )
    lambda.addToRolePolicy(policyStatement)
  }
}
