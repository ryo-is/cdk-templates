#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/cdk");
import { CdkDemoStack } from "../lib/cdk-demo-stack";

const app = new cdk.App();
new CdkDemoStack(app, 'CdkDemoStack');
app.run();
