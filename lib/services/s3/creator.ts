import cdk = require("@aws-cdk/core")
import s3 = require("@aws-cdk/aws-s3")

export class S3Creator {
  static CreateS3Bucket(self: cdk.Construct, bucketName: string) {
    return new s3.Bucket(self, bucketName, {
      bucketName: bucketName
    })
  }
}
