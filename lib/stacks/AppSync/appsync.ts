import cdk = require("@aws-cdk/core")
import { join } from "path"

import { UserPool, SignInType } from "@aws-cdk/aws-cognito"
import {
  GraphQLApi,
  FieldLogLevel,
  UserPoolDefaultAction
} from "@aws-cdk/aws-appsync"
import { TableProps, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb"

import { DynamoDBCreator } from "../../services/dynamodb/creator"

export class AppSyncStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "UserPool", {
      signInType: SignInType.USERNAME
    })

    const tableParam: TableProps = {
      tableName: "CDKPostTable",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "create_time",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    }
    const table = DynamoDBCreator.createTable(this, tableParam)

    const api = new GraphQLApi(this, "PostAPI", {
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

    api.addDynamoDbDataSource("PostAPIDataSource", "", table)
  }
}
