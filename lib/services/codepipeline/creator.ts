import cdk = require("@aws-cdk/cdk")
import codepipeline = require("@aws-cdk/aws-codepipeline")

export class CodePipelineCreator {
  /**
   * Create CodePipeline
   * @param {cdk.Construct} self
   * @param {String} pipelineName
   */
  static CreatePipeline(self: cdk.Construct, pipelineName: string) {
    return new codepipeline.Pipeline(self, pipelineName, {
      pipelineName: pipelineName
    })
  }

  /**
   * Add Pipeline Stage
   * @param {codepipeline.Pipeline} pipeline
   * @param {String} stageName
   */
  static AddStage(pipeline: codepipeline.Pipeline, stageName: string) {
    return pipeline.addStage({
      stageName: stageName
    })
  }
}
