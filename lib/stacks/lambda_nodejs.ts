import cdk = require("@aws-cdk/core")
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs"

export class NodejsFunctionStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new NodejsFunction(this, "NodejsFunction", {
      entry: "lambdaSources/demo_function/index.ts",
      handler: "handler"
    })
  }
}
