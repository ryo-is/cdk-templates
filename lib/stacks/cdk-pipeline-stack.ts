import cdk = require("@aws-cdk/cdk");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codecommit = require("@aws-cdk/aws-codecommit");
import codebuild = require("@aws-cdk/aws-codebuild");

import { CodePipelineCreator } from "../services/codepipeline/creator";
import { CodeCommitCreator } from "../services/codecommit/creator";
import { CodeBuildCreator } from "../services/codebuild/creator";

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create CodePipeline
     */
    const pipeline: codepipeline.Pipeline = CodePipelineCreator.CreatePipeline(this, "CdkCodePipeline");

    /**
     * Add Pipeline Stage
     */
    const sourceStage: codepipeline.Stage = CodePipelineCreator.AddStage(pipeline, "Source");
    const buildStage: codepipeline.Stage = CodePipelineCreator.AddStage(pipeline, "Build");

    /**
     * Create CodeCommit Repository
     */
    const repo: codecommit.Repository = CodeCommitCreator.CreateRepository(this, "CdkRepository");

    /**
     * Add CodePipeline Source Stage
     */
    CodeCommitCreator.AddSourceAction(repo, sourceStage, "PipelineSourceAction", "develop");

    /**
     * Create CodeBuild Project
     */
    const buildProject: codebuild.Project = CodeBuildCreator.CreateCodeBuild(this, "CdkCodeBuildProject");

    /**
     * Add CodePipeline Build Stage
     */
    CodeBuildCreator.AddBuildAction(buildProject, buildStage, "PipelineBuildAction");
  }
}
