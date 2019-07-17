#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { CdkStack } from "../lib/stacks/cdk-stack"
import { CdkAppSync } from "../lib/stacks/cdk_appsync"
import { CdkAPILambda } from "../lib/stacks/cdk_api_lambda"
import { CdkStreamLambda } from "../lib/stacks/cdk_stream_lambda"
import { CdkIoTDynamo } from "../lib/stacks/cdk_iot_dynamo"
import { CdkIoTLambda } from "../lib/stacks/cdk_iot_lambda"

const app: cdk.App = new cdk.App()
new CdkStack(app, "CdkStack")
new CdkAppSync(app, "CdkAppSync")
new CdkAPILambda(app, "CdkAPILambda")
new CdkStreamLambda(app, "CdkStreamLambda")
new CdkIoTDynamo(app, "CdkIoTDynamo")
new CdkIoTLambda(app, "CdkIoTLambda")
app.synth()
