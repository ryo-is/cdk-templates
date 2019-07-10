import cdk = require("@aws-cdk/core")
import { Table, TableProps } from "@aws-cdk/aws-dynamodb"

export class DynamoDBCreator {
  // Create DynamoDB Table
  public static CreateTable(self: cdk.Construct, tableParam: TableProps): Table {
    return new Table(self, (tableParam.tableName) as string, tableParam)
  }
}
