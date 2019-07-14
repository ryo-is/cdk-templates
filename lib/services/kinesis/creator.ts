import cdk = require("@aws-cdk/core")
import { Stream } from "@aws-cdk/aws-kinesis"

export class KinesisDataStreamCreator {
  // Create Stream
  public static createStream(
    self: cdk.Construct,
    streamNameValue: string,
    retentionPeriodHoursValue: number,
    shardCountValue: number
  ): Stream {
    return new Stream(self, streamNameValue, {
      streamName: streamNameValue,
      retentionPeriodHours: retentionPeriodHoursValue,
      shardCount: shardCountValue
    })
  }
}
