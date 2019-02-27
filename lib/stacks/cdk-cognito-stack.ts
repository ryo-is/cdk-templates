import cdk = require("@aws-cdk/cdk");
import cognito = require("@aws-cdk/aws-cognito");

import { CognitoCreator } from "../services/cognito/creator";

export class CdkCognitoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create Cognito UserPool
     */
    const userPool: cognito.CfnUserPool = CognitoCreator.CreateUserPool(this, "CdkCognitoUserPool");

    /**
     * Create Cognito UserPool Client
     */
    CognitoCreator.CreateUserPoolClient(this, "CdkCognitoUserPoolClient", userPool);
  }
}
