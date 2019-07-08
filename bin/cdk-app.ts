#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { CdkStack } from "../lib/stacks/cdk-stack"
import { PutImageLambda } from "../lib/stacks/put_image_lambda"

const app = new cdk.App()
new CdkStack(app, "CdkStack")
new PutImageLambda(app, "PutImageLambda")
app.synth()
