#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { VisitorManagementAppsync } from "../lib/stacks/visitor_management_appsync"
import { CalendarAPIStack } from "../lib/stacks/calendar_api"

const app: cdk.App = new cdk.App()
new VisitorManagementAppsync(app, "VisitorManagementAppsync")
new CalendarAPIStack(app, "CalendarAPIStack")
app.synth()
