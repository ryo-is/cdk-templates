import cdk = require("@aws-cdk/core")
import { Bucket } from "@aws-cdk/aws-s3"

export class S3Creator {
  public static CreateS3Bucket(self: cdk.Construct, name: string): Bucket {
    return new Bucket(self, name, {
      bucketName: name
    })
  }
}
