import cdk = require("@aws-cdk/cdk");
import codecommit = require("@aws-cdk/aws-codecommit");
import codepipeline = require("@aws-cdk/aws-codepipeline");

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
   * Add CodePipeline Source Stage
   * @param {codecommit.Repository} repo
   * @param {codepipeline.Stage} sourceStage
   * @param {String} id
   * @param {String} targetBranch
   */
  static AddSourceAction(
    repo: codecommit.Repository,
    sourceStage: codepipeline.Stage,
    id: string,
    targetBranch: string) {
      repo.addToPipeline(sourceStage, id, {
        branch: targetBranch,
        outputArtifactName: "App"
      })
  }
}
