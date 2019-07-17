import cdk = require("@aws-cdk/core")
import { Table, TableProps, AttributeType } from "@aws-cdk/aws-dynamodb"
import { Role, PolicyStatement } from "@aws-cdk/aws-iam"

import { DynamoDBCreator } from "../services/dynamodb/creator"
import { IAMCreator } from "../services/iam/creator"
import { IoTCoreCreator } from "../services/iotcore/creator"

export class CdkIoTDynamo extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tableNameValue: string = "CdkIoTDemoTable"
    const tableParam: TableProps = {
      tableName: tableNameValue,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)

    const roleActions: string[] = ["dynamodb:PutItem"]
    const roleResorces: string[] = [table.tableArn]
    const roleStatement: PolicyStatement = IAMCreator.createRoleStatement(roleActions, roleResorces)
    const iotServiceRole: Role = IAMCreator.createIoTCoreServiceRole(this, "CdkIoTServiceRole")
    iotServiceRole.addToPolicy(roleStatement)

    const sqlBody: string = "SELECT * FROM 'CdkIoTDemo/#'" // sql for topic rule
    IoTCoreCreator.createTopicRuleDynamoDBv2(this, "CDKIoTDynamoRule", tableNameValue, iotServiceRole.roleArn, sqlBody)
  }
}
