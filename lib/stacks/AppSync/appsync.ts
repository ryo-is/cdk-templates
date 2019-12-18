import cdk = require("@aws-cdk/core")
import { join } from "path"

import { UserPool, SignInType } from "@aws-cdk/aws-cognito"
import {
  GraphQLApi,
  FieldLogLevel,
  UserPoolDefaultAction
} from "@aws-cdk/aws-appsync"

export class AppSyncStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "UserPool", {
      signInType: SignInType.USERNAME
    })

    const api = new GraphQLApi(this, "GraphQLAPI", {
      name: `demoapi`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      userPoolConfig: {
        userPool,
        defaultAction: UserPoolDefaultAction.ALLOW
      },
      schemaDefinitionFile: join(__dirname, "schema.graphql")
    })
    console.log(api)
  }
}
