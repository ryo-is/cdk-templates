import cdk = require("@aws-cdk/core")
import { Table, TableProps, AttributeType } from "@aws-cdk/aws-dynamodb"
import { Role, PolicyStatement, Effect, ServicePrincipal } from "@aws-cdk/aws-iam"
import { CfnTopicRule } from "@aws-cdk/aws-iot"

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
    // Create DynamoDB Table
    const table: Table = new Table(this, tableNameValue, tableParam)

    const roleActions: string[] = ["dynamodb:PutItem"]
    const roleResorces: string[] = [table.tableArn]
    // Create RoleStatement
    const roleStatement: PolicyStatement = new PolicyStatement({
      actions: roleActions,
      resources: roleResorces
    })
    roleStatement.effect = Effect.ALLOW
    // Create IoTCore ServiceRole
    const iotServiceRole: Role = new Role(this, "CdkIoTServiceRole", {
      assumedBy: new ServicePrincipal("iot.amazonaws.com")
    })
    iotServiceRole.addToPolicy(roleStatement)

    // sql for topic rule
    const sqlBody: string = "SELECT * FROM 'CdkIoTDemo/#'"
    // Create TopicRule DynamoDBv2
    new CfnTopicRule(this, "CDKIoTDynamoRule", {
      ruleName: "CDKIoTDynamoRule",
      topicRulePayload: {
        actions: [{
          dynamoDBv2: {
            putItem: { tableName: tableNameValue },
            roleArn: iotServiceRole.roleArn
          }
        }],
        ruleDisabled: false,
        sql: sqlBody
      }
    })
  }
}
