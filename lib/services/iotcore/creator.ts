import cdk = require("@aws-cdk/core")
import { CfnTopicRule } from "@aws-cdk/aws-iot"

export class IoTCoreCreator {

  // Create TopicRule
  public static createTopicRule(
    self: cdk.Construct,
    tableNameValue: string,
    roleArnValue: string,
    sqlBody: string
  ): CfnTopicRule {
    return new CfnTopicRule(self, "CdkTopicRule", {
      ruleName: "CdkTopicRule",
      topicRulePayload: {
        actions: [{
          dynamoDBv2: {
            putItem: { tableName: tableNameValue },
            roleArn: roleArnValue
          }
        }],
        ruleDisabled: false,
        sql: sqlBody
      }
    })
  }
}
