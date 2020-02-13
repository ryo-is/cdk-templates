import cdk = require("@aws-cdk/core")
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs"
import { Tracing } from "@aws-cdk/aws-lambda"

export class XRayDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new NodejsFunction(this, "NodejsFunction", {
      entry: "lambdaSources/xray_demo_function/index.ts",
      handler: "handler",
      minify: true,
      tracing: Tracing.ACTIVE
    })
  }
}
