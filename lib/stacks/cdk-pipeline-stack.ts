import cdk = require("@aws-cdk/core")
import codepipeline = require("@aws-cdk/aws-codepipeline")
import codecommit = require("@aws-cdk/aws-codecommit")
import codebuild = require("@aws-cdk/aws-codebuild")

import { CodePipelineCreator } from "../services/codepipeline/creator"
import { CodeCommitCreator } from "../services/codecommit/creator"
import { CodeBuildCreator } from "../services/codebuild/creator"

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    /**
     * Create CodePipeline
     */
    const pipeline: codepipeline.Pipeline = CodePipelineCreator.CreatePipeline(this, "CdkCodePipeline")
    const pipelineArtifact: codepipeline.Artifact = new codepipeline.Artifact("OutputArtifact")

    /**
     * Add Pipeline Stage
     */
    const sourceStage: codepipeline.IStage = CodePipelineCreator.AddStage(pipeline, "Source")
    const buildStage: codepipeline.IStage = CodePipelineCreator.AddStage(pipeline, "Build")

    /**
     * Create CodeCommit Repository
     */
    const repo: codecommit.Repository = CodeCommitCreator.CreateRepository(this, "CdkRepository")

    /**
     * Create CodeBuild Project
     */
    const buildProject: codebuild.Project = CodeBuildCreator.CreateCodeBuild(this, "CdkCodeBuildProject", repo)

    /**
     * Add CodePipeline Source Stage
     */
    const sourceAction: codepipeline.IAction = CodeCommitCreator.CreateSourceAction(repo, pipelineArtifact, "develop")
    CodeCommitCreator.AddSourceAction(sourceStage, sourceAction)

    /**
     * Add CodePipeline Build Stage
     */
    CodeBuildCreator.AddBuildAction(buildStage, pipelineArtifact, buildProject)
  }
}
