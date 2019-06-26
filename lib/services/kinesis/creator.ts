import cdk = require("@aws-cdk/core")
import kinesis = require("@aws-cdk/aws-kinesis")

export class KinesisStreamsCreator {
  /**
   * Create KinesisStreams
   * @param {cdk.Construct} self
   * @param {String} id
   * @param {Number} shardCount
   */
  static CreateKinesisStream(self: cdk.Construct, id: string, shardCount: number) {
    new kinesis.Stream(self, id, {
      streamName: id,
      shardCount: shardCount
    })
  }
}
