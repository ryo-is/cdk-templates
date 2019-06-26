import cdk = require("@aws-cdk/core")
import cpapi = require("@aws-cdk/aws-codepipeline")
import codebuild = require("@aws-cdk/aws-codebuild")
import codecommit = require("@aws-cdk/aws-codecommit")
import codepipeline = require("@aws-cdk/aws-codepipeline")
import codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions")

import { S3Creator } from "../s3/creator"

export class CodeBuildCreator {
  /**
   * Create CodeBuild Project
   * @param {cdk.Construct} self
   * @param {String} id
   */
  static CreateCodeBuild(self: cdk.Construct, id: string, repo: codecommit.IRepository) {
    return new codebuild.Project(self, id, {
      projectName: id,
      artifacts: codebuild.Artifacts.s3({
        bucket: S3Creator.CreateS3Bucket(self, "codebuildArtifactsBucket"),
        name: "codebuildArtifactsBucket"
      }),
      source: codebuild.Source.codeCommit({
        repository: repo
      }),
      environment: {
        computeType: codebuild.ComputeType.SMALL,
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
        privileged: true,
        environmentVariables: {
          "ENV_NAME": {
            value: "development"
          }
        }
      }
    })
  }

  /**
   * Add CodePipeline Build Stage
   * @param {codepipeline.Stage} buildStage
   * @param {cpapi.SourceAction} sourceAction
   * @param {codebuild.Project} buildProject
   */
  static AddBuildAction(buildStage: cpapi.IStage, outputArtifact: codepipeline.Artifact, buildProject: codebuild.Project) {
    buildStage.addAction(new codepipeline_actions.CodeBuildAction({
      actionName: "Build",
      input: outputArtifact,
      project: buildProject
    }))
  }
}
