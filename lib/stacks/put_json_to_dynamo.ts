import cdk = require("@aws-cdk/cdk")
import lambda = require("@aws-cdk/aws-lambda")
import iam = require("@aws-cdk/aws-iam")

import { LambdaFunctionCreator } from "../services/lambda_function/creator"
import { IAMCreator } from "../services/iam/creator"

export class PutJsonToDynamo extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambdaFunction: lambda.Function = LambdaFunctionCreator.CreateLambdaFunction(this, "PutEmployeeDataLambda", "index.handler", "")

    const s3Statement: iam.PolicyStatement = IAMCreator.CreateS3GetObjectRoleStatement("arn:aws:s3:::convention-employee-data/*")
    lambdaFunction.addToRolePolicy(s3Statement)
    const ddbStatement: iam.PolicyStatement = IAMCreator.CreateDDBReadWriteRoleStatement("arn:aws:dynamodb:ap-northeast-1:*:table/m_employeeTable")
    lambdaFunction.addToRolePolicy(ddbStatement)
  }
}
