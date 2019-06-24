import iam = require("@aws-cdk/aws-iam")

export class IAMCreator {
  static CreateDDBReadWriteRoleStatement(tableArn: string) {
    const policyStatement = new iam.PolicyStatement(
      {
        actions: [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        resources: [tableArn]
      }
    )
    policyStatement.effect = iam.Effect.Allow
    return policyStatement
  }

  static CreateS3GetObjectRoleStatement(s3Arn: string) {
    const policyStatement = new iam.PolicyStatement(
      {
        actions: [
          "s3:GetObject"
        ],
        resources: [s3Arn]
      }
    )
    policyStatement.effect = iam.Effect.Allow
    return policyStatement
  }
}
