import cdk = require("@aws-cdk/core")
import {
  Table,
  TableProps,
  AttributeType,
  BillingMode
} from "@aws-cdk/aws-dynamodb"
import { Role, PolicyStatement } from "@aws-cdk/aws-iam"
import {
  CfnGraphQLApi,
  CfnDataSource,
  CfnGraphQLSchema,
  CfnResolver
} from "@aws-cdk/aws-appsync"

import { DynamoDBCreator } from "../services/dynamodb/creator"
import { IAMCreator } from "../services/iam/creator"
import { AppSyncCreator } from "../services/appsync/creator"

export class VistorManagementAppsync extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tableName: string = "VistorManagement"
    const tableParam: TableProps = {
      tableName: tableName,
      partitionKey: {
        name: "prace",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "create_time",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      writeCapacity: 1,
      readCapacity: 1
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)

    const tableRole: Role = IAMCreator.createAppSyncServiceRole(
      this,
      "VistorManagementAppsyncRole"
    )
    const policyStatement: PolicyStatement = IAMCreator.createRoleStatement(
      [
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      [table.tableArn]
    )
    tableRole.addToPolicy(policyStatement)

    const tableResouce = table.node.findChild("Resource") as cdk.CfnResource
    tableResouce.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)

    const graphqlAPI: CfnGraphQLApi = AppSyncCreator.createCognitoAuthGraphQLAPI(
      this,
      "VistorManagementAPI"
    )
  }
}
