#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
// import { CdkStack } from "../lib/stacks/cdk-stack"
// import { KinesisAnalyticsStack } from "../lib/stacks/kinesis_analytics_stack"
// import { CdkPipelineStack } from "../lib/stacks/cdk-pipeline-stack"
// import { PythonLambdaStack } from "../lib/stacks/lambda-python-stack"
// import { KansaitsDemoStack } from "../lib/stacks/kansaits_demo_stack"
// import { PutJsonToDynamo } from "../lib/stacks/put_json_to_dynamo"
import { PutImageLambda } from "../lib/stacks/put_image_lambda"

const app = new cdk.App()
// new CdkStack(app, "CdkStack")
// new KinesisAnalyticsStack(app, "KinesisAnalyticsStack")
// new CdkPipelineStack(app, "CdkPipelineStack")
// new PythonLambdaStack(app, "PythonLambdaStack")
// new KansaitsDemoStack(app, "KansaitsDemoStack")
// new PutJsonToDynamo(app, "PutJsonToDynamo")
new PutImageLambda(app, "PutImageLambda")
app.synth()
