import cdk = require("@aws-cdk/core")

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
            resourceArn: "arn:aws:kinesis:us-west-2:xxxxxxxxxxxx:stream/rideologyCloudStreams",
            roleArn: "arn:aws:iam::xxxxxxxxxxxx:role/service-role/kinesis-analytics-summarize_riding_log_high-us-west-2"
          },
          namePrefix: "hoge"
        }
      ],
      applicationCode: `CREATE OR REPLACE STREAM "RIDING_LOG_HIGH_STREAM" (
        "count" INTEGER,
        "user_and_bikeID" VARCHAR(16),
        "riding_log_type" VARCHAR(8),
        "record_time" TIMESTAMP,
        "engine_RPM" decimal(9,4),
        "wheel_speed" double,
        "acceleration" double,
        "lean_angle" double,
        "wheelie_angle" double,
        "yaw_rate_reserve" double,
        "roll_rate" double,
        "throttle_position" double,
        "boost_pressure" double,
        "gear_position" INTEGER)

        CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "RIDING_LOG_HIGH_STREAM"
        SELECT STREAM
        COUNT(*) over RSW,
        "user_and_bikeID",
        max("riding_log_type") over RSW,
        max("record_time") over RSW,
        avg("engine_RPM") over RSW,
        avg("wheel_speed") over RSW,
        avg("acceleration") over RSW,
        avg("lean_angle") over RSW,
        avg("wheelie_angle") over RSW,
        avg("yaw_rate_reserve") over RSW,
        avg("roll_rate") over RSW,
        avg("throttle_position") over RSW,
        avg("boost_pressure") over RSW,
        max("gear_position") over RSW
        FROM "SOURCE_SQL_STREAM_001"
        where "riding_log_type" similar to '%high%'
        window RSW as (partition by "user_and_bikeID"  ROWS 1 preceding)`
    })
  }
}
