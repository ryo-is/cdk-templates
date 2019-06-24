import cdk = require("@aws-cdk/cdk")
import cognito = require("@aws-cdk/aws-cognito")

export class CognitoCreator {
  /**
   * Create Cognito UserPool
   * @param {cdk.Construct} self
   * @param {String} id
   */
  static CreateUserPool(self: cdk.Construct, id: string) {
    return new cognito.CfnUserPool(self, id, {
      userPoolName: id,
      policies: {
        passwordPolicy: {
          minimumLength: 8,
          requireLowercase: true,
          requireNumbers: true,
          requireUppercase: true,
          requireSymbols: false
        }
      },
      schema: [
        {
          name: "email",
          attributeDataType: "String",
          required: true
        }
      ],
      autoVerifiedAttributes: ["email"],
      emailVerificationSubject: "Your verification code",
      emailVerificationMessage: "Your verification code is {####}"
    })
  }

  /**
   * Create Cognito UserPool Client
   * @param {cdk.Construct} self
   * @param {String} id
   * @param {cognito.CfnUserPool} userPool
   */
  static CreateUserPoolClient(self: cdk.Construct, id: string, userPool: cognito.UserPool) {
    new cognito.CfnUserPoolClient(self, id, {
      clientName: id,
      userPoolId: userPool.userPoolId
    })
  }
}
