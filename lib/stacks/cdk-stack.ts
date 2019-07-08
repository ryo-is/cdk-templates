import cdk = require("@aws-cdk/core")

import { S3Creator } from "../services/s3/creator"

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    /**
     * Create S3 bucket
     */
    S3Creator.CreateS3Bucket(this, "cdk-stack-bucket")
  }
}
