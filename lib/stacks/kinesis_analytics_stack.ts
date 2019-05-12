import cdk = require("@aws-cdk/cdk")

import kinesisAnalytics = require("@aws-cdk/aws-kinesisanalytics")

export class KinesisAnalyticsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new kinesisAnalytics.CfnApplication(this, "kinesisAnalytics", {
      inputs: [
        {
          inputSchema: {
            recordColumns: [
              {
                name: "user_and_bikeID",
                sqlType: "VARCHAR(16)"
              }
            ],
            recordFormat: {
              recordFormatType: "JSON"
            }
          },
          kinesisStreamsInput: {
            resourceArn: "arn:aws:kinesis:us-west-2:853419781618:stream/rideologyCloudStreams",
            roleArn: "arn:aws:iam::853419781618:role/service-role/kinesis-analytics-summarize_riding_log_high-us-west-2"
          },
          namePrefix: "hoge"
        }
      ],
    })
  }
}
