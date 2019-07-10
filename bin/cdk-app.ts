#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { CdkStack } from "../lib/stacks/cdk-stack"
import { CdkAppSync } from "../lib/stacks/cdk_appsync"
import { CdkAPILambda } from "../lib/stacks/cdk_api_lambda"

const app = new cdk.App()
new CdkStack(app, "CdkStack")
new CdkAppSync(app, "CdkAppSync")
new CdkAPILambda(app, "CdkAPILambda")
app.synth()
