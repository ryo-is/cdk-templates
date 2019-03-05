import cdk = require("@aws-cdk/cdk");
import codecommit = require("@aws-cdk/aws-codecommit");
import cpapi = require("@aws-cdk/aws-codepipeline-api");

export class CodeCommitCreator {
  /**
   * Create CodeCommit Repository
   * @param {cdk.Construct} self
   * @param {String} repositoryName
   */
  static CreateRepository(self: cdk.Construct, repositoryName: string) {
    return new codecommit.Repository(self, repositoryName, {
      repositoryName: repositoryName
    });
  }

  /**
   * Create CodePipeline Source Stage
   * @param {codecommit.Repository} repo
   * @param {String} targetBranch
   */
  static CreateSourceAction(repo: codecommit.Repository, targetBranch: string) {
      return new codecommit.PipelineSourceAction({
        actionName: "Source",
        outputArtifactName: "SourceArtifact",
        branch: targetBranch,
        repository: repo
      })
  }

  /**
   * Add CodePipeline Source Stage
   * @param {cpapi.IStage} sourceStage
   * @param {cpapi.SourceAction} sourceAction
   */
  static AddSourceAction(sourceStage: cpapi.IStage, sourceAction: cpapi.SourceAction) {
    sourceStage.addAction(sourceAction);
  }
}
