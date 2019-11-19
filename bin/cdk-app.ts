#!/usr/bin/env node
import cdk = require("@aws-cdk/core")
import { VisitorManagementAppsync } from "../lib/stacks/visitor_management_appsync"
import { CalendarAPIStack } from "../lib/stacks/calendar_api"
import { RestAPIs } from "../lib/stacks/rest_apis"

const app: cdk.App = new cdk.App()
new VisitorManagementAppsync(app, "VisitorManagementAppsync")
new CalendarAPIStack(app, "CalendarAPIStack")
new RestAPIs(app, "RestAPIs")
