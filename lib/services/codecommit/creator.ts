import cdk = require("@aws-cdk/core")
import codecommit = require("@aws-cdk/aws-codecommit")
import codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions")
import codepipeline = require("@aws-cdk/aws-codepipeline")

export class CodeCommitCreator {
  /**
   * Create CodeCommit Repository
   * @param {cdk.Construct} self
   * @param {String} repositoryName
   */
  static CreateRepository(self: cdk.Construct, repositoryName: string) {
    return new codecommit.Repository(self, repositoryName, {
      repositoryName: repositoryName
    })
  }

  /**
   * Create CodePipeline Source Stage
   * @param {codecommit.Repository} repo
   * @param {String} targetBranch
   */
  static CreateSourceAction(repo: codecommit.Repository, outputArtifact: codepipeline.Artifact, targetBranch: string) {
    return new codepipeline_actions.CodeCommitSourceAction({
      actionName: "Source",
      output: outputArtifact,
      branch: targetBranch,
      repository: repo
    })
  }

  /**
   * Add CodePipeline Source Stage
   * @param {codepipeline.IStage} sourceStage
   * @param {codepipeline.IAction} sourceAction
   */
  static AddSourceAction(sourceStage: codepipeline.IStage, sourceAction: codepipeline.IAction) {
    sourceStage.addAction(sourceAction)
  }
}
