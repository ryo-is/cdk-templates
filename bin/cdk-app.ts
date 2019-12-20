#!/usr/bin/env node
import cdk = require("@aws-cdk/core")

// import { VisitorManagementAppsync } from "../lib/stacks/visitor_management_appsync"
// import { CalendarAPIStack } from "../lib/stacks/calendar_api"
// import { LambdaLayerStack } from "../lib/stacks/lambda_layer"
import { AppSyncStack } from "../lib/stacks/AppSync/appsync"
import { GoogleMapAPIStack } from "../lib/stacks/google_map_api"

// import { RestAPIStack } from "../lib/stacks/RestAPIs/rest_api"
// import { APIResourcesStack } from "../lib/stacks/RestAPIs/api_resources"
// import RestApiParam from "./parameters/RestApiParam.json"
// import RestApiResouceParam from "./parameters/restApiResouceParams.json"

const app: cdk.App = new cdk.App()

new AppSyncStack(app, "AppSyncStack")
new GoogleMapAPIStack(app, "GoogleMapAPIStack")
