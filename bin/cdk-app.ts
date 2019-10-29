#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { VistorManagementAppsync } from "../lib/stacks/vistor_management_appsync"

const app: cdk.App = new cdk.App()
new VistorManagementAppsync(app, "VistorManagementAppsync")
app.synth()
