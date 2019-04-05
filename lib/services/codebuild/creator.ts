import cdk = require("@aws-cdk/cdk");
import cpapi = require("@aws-cdk/aws-codepipeline");
import codebuild = require("@aws-cdk/aws-codebuild");

export class CodeBuildCreator {
  /**
   * Create CodeBuild Project
   * @param {cdk.Construct} self
   * @param {String} id
   */
  static CreateCodeBuild(self: cdk.Construct, id: string) {
    return new codebuild.Project(self, id, {
      projectName: id,
      artifacts: new codebuild.CodePipelineBuildArtifacts(),
      source: new codebuild.CodePipelineSource(),
      environment: {
        computeType: codebuild.ComputeType.Small,
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
        privileged: true,
        environmentVariables: {
          "ENV_NAME": {
            value: "development"
          }
        }
      }
    });
  }

  /**
   * Add CodePipeline Build Stage
   * @param {codepipeline.Stage} buildStage
   * @param {cpapi.SourceAction} sourceAction
   * @param {codebuild.Project} buildProject
   */
  static AddBuildAction(buildStage: cpapi.IStage, sourceAction: cpapi.SourceAction, buildProject: codebuild.Project) {
    buildStage.addAction(new codebuild.PipelineBuildAction({
      actionName: "Build",
      inputArtifact: sourceAction.outputArtifact,
      project: buildProject
    }));
  }
}
