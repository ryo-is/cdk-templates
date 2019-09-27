import cdk = require("@aws-cdk/core")
import { CfnTopicRule } from "@aws-cdk/aws-iot"

export class IoTCoreCreator {
  // Create TopicRule DynamoDBv2
  public static createTopicRuleDynamoDBv2(
    self: cdk.Construct,
    ruleNameValue: string,
    tableNameValue: string,
    roleArnValue: string,
    sqlBody: string
  ): CfnTopicRule {
    return new CfnTopicRule(self, ruleNameValue, {
      ruleName: ruleNameValue,
      topicRulePayload: {
        actions: [
          {
            dynamoDBv2: {
              putItem: { tableName: tableNameValue },
              roleArn: roleArnValue
            }
          }
        ],
        ruleDisabled: false,
        sql: sqlBody
      }
    })
  }

  // Create TopicRule invoke LambdaFunction
  public static createTopicRuleInvokeLambda(
    self: cdk.Construct,
    ruleNameValue: string,
    functionArnValue: string,
    sqlBody: string
  ): CfnTopicRule {
    return new CfnTopicRule(self, ruleNameValue, {
      ruleName: ruleNameValue,
      topicRulePayload: {
        actions: [
          {
            lambda: {
              functionArn: functionArnValue
            }
          }
        ],
        ruleDisabled: false,
        sql: sqlBody
      }
    })
  }
}
