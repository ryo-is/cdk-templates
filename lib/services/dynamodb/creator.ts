import cdk = require("@aws-cdk/core")
import { Table, TableProps } from "@aws-cdk/aws-dynamodb"

export class DynamoDBCreator {
  // Create DynamoDB Table
  public static createTable(
    self: cdk.Construct,
    tableParam: TableProps
  ): Table {
    if (tableParam.tableName === undefined) {
      return new Table(self, "createTable", tableParam)
    }
    return new Table(self, tableParam.tableName, tableParam)
  }
}
