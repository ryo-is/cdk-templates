import cdk = require("@aws-cdk/core")
import { Bucket } from "@aws-cdk/aws-s3"

export class S3Creator {
  static CreateS3Bucket(self: cdk.Construct, bucketName: string) {
    return new Bucket(self, bucketName, {
      bucketName: bucketName
    })
  }
}
