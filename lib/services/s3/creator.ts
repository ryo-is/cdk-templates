import cdk = require("@aws-cdk/cdk")
import s3 = require("@aws-cdk/aws-s3")
import physicalName = require("@aws-cdk/cdk/lib/physical-name")

export class S3Creator {
  static CreateS3Bucket(self: cdk.Construct, bucketName: string) {
    return new s3.Bucket(self, bucketName, {
      bucketName: physicalName.PhysicalName.of(bucketName)
    })
  }
}
