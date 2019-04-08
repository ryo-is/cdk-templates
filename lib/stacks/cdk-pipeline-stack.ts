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
    const sourceStage: codepipeline.IStage = CodePipelineCreator.AddStage(pipeline, "Source");
    const buildStage: codepipeline.IStage = CodePipelineCreator.AddStage(pipeline, "Build");

    /**
     * Create CodeCommit Repository
     */
    const repo: codecommit.Repository = CodeCommitCreator.CreateRepository(this, "CdkRepository");

    /**
     * Create CodeBuild Project
     */
    const buildProject: codebuild.Project = CodeBuildCreator.CreateCodeBuild(this, "CdkCodeBuildProject");

    /**
     * Add CodePipeline Source Stage
     */
    const sourceAction: codepipeline.SourceAction = CodeCommitCreator.CreateSourceAction(repo, "develop");
    CodeCommitCreator.AddSourceAction(sourceStage, sourceAction);

    /**
     * Add CodePipeline Build Stage
     */
    CodeBuildCreator.AddBuildAction(buildStage, sourceAction, buildProject);
  }
}
