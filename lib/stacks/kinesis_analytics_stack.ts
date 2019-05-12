import cdk = require("@aws-cdk/cdk")

import kinesisAnalytics = require("@aws-cdk/aws-kinesisanalytics")

export class KinesisAnalyticsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }
}
