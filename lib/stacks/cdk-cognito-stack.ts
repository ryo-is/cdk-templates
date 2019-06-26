import cdk = require("@aws-cdk/core")
// import cognito = require("@aws-cdk/aws-cognito")

// import { CognitoCreator } from "../services/cognito/creator"

export class CdkCognitoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // TODO:Cognitoをまた作るときに調べる

    /**
     * Create Cognito UserPool
     */
    // const userPool: cognito.UserPool = CognitoCreator.CreateUserPool(this, "CdkCognitoUserPool")

    /**
     * Create Cognito UserPool Client
     */
    // CognitoCreator.CreateUserPoolClient(this, "CdkCognitoUserPoolClient", userPool)
  }
}
