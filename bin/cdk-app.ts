#!/usr/bin/env node
import cdk = require("@aws-cdk/core")

import { VisitorManagementAppsync } from "../lib/stacks/visitor_management_appsync"
import { CalendarAPIStack } from "../lib/stacks/calendar_api"
import { RestAPIStack } from "../lib/stacks/RestAPIs/rest_api"
import { APIResourcesStack } from "../lib/stacks/RestAPIs/api_resources"
import { LambdaLayerStack } from "../lib/stacks/lambda_layer"

import RestApiParam from "./parameters/RestApiParam.json"
import RestApiResouceParam from "./parameters/restApiResouceParams.json"

const app: cdk.App = new cdk.App()

new VisitorManagementAppsync(app, "VisitorManagementAppsync")
new CalendarAPIStack(app, "CalendarAPIStack")

const restApiStack = new RestAPIStack(app, "RestAPIStack", RestApiParam)
new APIResourcesStack(
  app,
  "APIResourcesStack",
  restApiStack.RestAPI,
  RestApiParam,
  RestApiResouceParam
)

new LambdaLayerStack(app, "LambdaLayerStack")
