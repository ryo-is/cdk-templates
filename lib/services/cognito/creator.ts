import cdk = require("@aws-cdk/core")
import { UserPool, UserPoolAttribute, SignInType } from "@aws-cdk/aws-cognito"

export class CognitoCreator {
  public static createUserPool(self: cdk.Construct, name: string): UserPool {
    return new UserPool(self, name, {
      userPoolName: name,
      signInType: SignInType.USERNAME,
      usernameAliasAttributes: [UserPoolAttribute.EMAIL]
    })
  }
}
