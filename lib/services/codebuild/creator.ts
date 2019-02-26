import cdk = require("@aws-cdk/cdk");
import codepipeline = require("@aws-cdk/aws-codepipeline");
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
   * @param {codebuild.Project} project
   * @param {codepipeline.Stage} stage
   * @param {String} id
   */
  static AddBuildAction(project: codebuild.Project, stage: codepipeline.Stage, id: string) {
    project.addToPipeline(stage, id);
  }
}
