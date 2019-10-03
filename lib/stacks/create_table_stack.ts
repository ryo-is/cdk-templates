import cdk = require("@aws-cdk/core")
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb"

export class CreateTableStack extends cdk.Stack {
  public table: Table

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.table = new Table(this, "cdkTable", {
      tableName: "cdkTable",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    })
    const cfnTable = this.table.node.findChild("Resource") as cdk.CfnResource
    cfnTable.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)
  }
}
