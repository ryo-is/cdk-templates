#!/usr/bin/env node
import cdk = require("@aws-cdk/core")

import { AppSyncStack } from "../lib/stacks/AppSync/appsync"
import { GoogleMapAPIStack } from "../lib/stacks/google_map_api"
import { CreateVPCStack } from "../lib/stacks/create_vpc"
import { NodejsFunctionStack } from "../lib/stacks/lambda_nodejs"

// import { RestAPIStack } from "../lib/stacks/RestAPIs/rest_api"
// import { APIResourcesStack } from "../lib/stacks/RestAPIs/api_resources"
// import RestApiParam from "./parameters/RestApiParam.json"
// import RestApiResouceParam from "./parameters/restApiResouceParams.json"

const app: cdk.App = new cdk.App()

new AppSyncStack(app, "AppSyncStack")
new GoogleMapAPIStack(app, "GoogleMapAPIStack")
new CreateVPCStack(app, "CreateVPCStack", {
  env: {
    region: "us-west-2"
  }
})
new NodejsFunctionStack(app, "NodejsFunctionStack")
