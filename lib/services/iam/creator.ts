import iam = require("@aws-cdk/aws-iam")

export class IAMCreator {
  static CreateDDBReadWriteRoleStatement(tableArn: string) {
    return new iam.PolicyStatement().allow()
      .addActions(
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      )
      .addResource(
        tableArn
      )
  }

  static CreateS3GetObjectRoleStatement(s3Arn: string) {
    return new iam.PolicyStatement().allow()
      .addActions(
        "s3:GetObject"
      )
      .addResource(
        s3Arn
      )
  }
}
