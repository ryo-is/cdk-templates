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

  // Create RoleStatement
  public static createRoleStatement(actionsValue: string[], resourcesValue: string[]): PolicyStatement {
    const policyStatement: PolicyStatement = new PolicyStatement(
      {
        actions: actionsValue,
        resources: resourcesValue,
        effect: Effect.ALLOW
      }
    )
    return policyStatement
  }

  // Create AppSync ServiceRole
  public static createAppSyncServiceRole(self: cdk.Construct, roleName: string): Role {
    return new Role(self, roleName, { assumedBy: new ServicePrincipal("appsync.amazonaws.com") })
  }

  // Create IoTCore ServiceRole
  public static createIoTCoreServiceRole(self: cdk.Construct, roleName: string): Role {
    return new Role(self, roleName, { assumedBy: new ServicePrincipal("iot.amazonaws.com") })
  }
}
