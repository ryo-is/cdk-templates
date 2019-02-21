import cdk = require("@aws-cdk/cdk");
import dynamodb = require("@aws-cdk/aws-dynamodb");

/**
 * Create DynamoDB Table
 * @param {cdk.Construct} self
 * @param {dynamodb.TableProps} tableParam
 */
export function CreateDynamoDB(self: cdk.Construct, tableParam: dynamodb.TableProps) {
  return  new dynamodb.Table(self, (tableParam.tableName) as string, tableParam);
}
