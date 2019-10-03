#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("@aws-cdk/core")
import { CreateTableStack } from "../lib/stacks/create_table_stack"
import { CreateLambdaStack } from "../lib/stacks/create_lambda_stack"

const app: cdk.App = new cdk.App()
const createTableStack = new CreateTableStack(app, "CreateTableStack")
const createLambdaStack = new CreateLambdaStack(
  app,
  "CreateLambdaStack",
  createTableStack.table
)
createLambdaStack.addDependency(createTableStack)
app.synth()
