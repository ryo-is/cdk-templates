import cdk = require("@aws-cdk/core")
import { Table } from "@aws-cdk/aws-dynamodb"
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda"
import { PolicyStatement, Effect } from "@aws-cdk/aws-iam"

export class CreateLambdaStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    table: Table,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    const lambdaFunction: Function = new Function(this, "cdkLambda", {
      functionName: "cdkLambda",
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset("lambdaSources/demo_function"),
      handler: "index.handler",
      memorySize: 128
    })
    const policyStatement: PolicyStatement = new PolicyStatement({
      actions: ["dynamodb:Query", "dynamodb:PutItem"],
      resources: [table.tableArn],
      effect: Effect.ALLOW
    })
    lambdaFunction.addToRolePolicy(policyStatement)
  }
}
