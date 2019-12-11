import cdk = require("@aws-cdk/core")

import { LayerVersion, AssetCode, Runtime } from "@aws-cdk/aws-lambda"

export class LambdaLayerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new LayerVersion(this, "NodeLambdaLayer", {
      code: AssetCode.fromAsset("lambdaSources/demo_function"),
      compatibleRuntimes: [Runtime.NODEJS_12_X]
    })
  }
}
