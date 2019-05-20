import cdk = require("@aws-cdk/cdk")
import lambda = require("@aws-cdk/aws-lambda")
import apigateway = require("@aws-cdk/aws-apigateway")

export class KansaitsDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const demoLambda: lambda.Function = new lambda.Function(this, "demoLambda", {
      functionName: "KansaitsDemoLambda",
      runtime: lambda.Runtime.Python37,
      code: lambda.Code.directory("resources/python"),
      handler: "index.handler",
      memorySize: 128,
      timeout: 29
    })

    const demoAPI: apigateway.RestApi = new apigateway.RestApi(this, "demoAPI", {
      restApiName: "KansaitsDemoAPIGateway"
    })

    const integretion: apigateway.Integration = new apigateway.LambdaIntegration(demoLambda)

    const getAPI: apigateway.Resource = demoAPI.root.addResource("get")
    getAPI.addMethod("GET", integretion, {
      apiKeyRequired: false
    })
  }
}
