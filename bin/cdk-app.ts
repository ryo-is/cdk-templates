#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/cdk")
import { KansaitsDemoStack } from "../lib/stacks/kansaits_demo_stack"


const app = new cdk.App()
// new CdkStack(app, "CdkStack")
// new CdkPipelineStack(app, "CdkPipelineStack")
// new CdkCognitoStack(app, "CdkCognitoStack")
// new PythonLambdaStack(app, "PythonLambdaStack")
// new KinesisAnalyticsStack(app, "KinesisAnalyticsStack")
new KansaitsDemoStack(app, "KansaitsDemoStack")
app.run()
