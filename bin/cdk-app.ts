#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/cdk")
import { CdkStack } from "../lib/stacks/cdk-stack"
import { CdkPipelineStack } from "../lib/stacks/cdk-pipeline-stack"
import { CdkCognitoStack } from "../lib/stacks/cdk-cognito-stack"
import { PythonLambdaStack } from "../lib/stacks/lambda-python-stack"
import { KinesisAnalyticsStack } from "../lib/stacks/kinesis_analytics_stack"

const app = new cdk.App()
new CdkStack(app, "CdkStack")
new CdkPipelineStack(app, "CdkPipelineStack")
new CdkCognitoStack(app, "CdkCognitoStack")
new PythonLambdaStack(app, "PythonLambdaStack")
new KinesisAnalyticsStack(app, "KinesisAnalyticsStack")
app.run()
