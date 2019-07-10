import cdk = require("@aws-cdk/core")
import { PolicyStatement, Effect, Role, ServicePrincipal } from "@aws-cdk/aws-iam"

export class IAMCreator {
  public static createDDBReadWriteRoleStatement(tableArn: string): PolicyStatement {
    const policyStatement: PolicyStatement = new PolicyStatement(
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
    policyStatement.effect = Effect.ALLOW
    return policyStatement
  }

  public static createAppSyncServiceRole(self: cdk.Construct, roleName: string): Role {
    return new Role(self, roleName, { assumedBy: new ServicePrincipal("appsync.amazonaws.com") })
  }
}
