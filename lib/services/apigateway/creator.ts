import cdk = require("@aws-cdk/core")
import {
  RestApi,
  CfnAuthorizer,
  Resource,
  Integration,
  MethodOptions,
  MockIntegration,
  PassthroughBehavior,
  EmptyModel
} from "@aws-cdk/aws-apigateway"

export class APIGatewayCreator {
  // Create APIGateway RestApi
  static createRestApi(self: cdk.Construct, apiName: string, apiDescription: string) {
    return new RestApi(self, apiName, {
      restApiName: apiName,
      description: apiDescription
    })
  }

  // Create APIGateway Authorizer
  static createAuthorizer(self: cdk.Construct, authorizerName: string, api: RestApi) {
    return new CfnAuthorizer(self, authorizerName, {
      restApiId: api.restApiId,
      name: authorizerName,
      identitySource: "method.request.header.Authorization",
      providerArns: [""],
      type: "COGNITO_USER_POOLS"
    })
  }

  // Add Resoruce to RestApi Root
  static addResouceToRestApi(restApi: RestApi, path: string) {
    return restApi.root.addResource(path)
  }

  // Add Method to Resource
  static addMethodToResource(resource: Resource, method: string, integration: Integration, options?: MethodOptions) {
    return resource.addMethod(method, integration, options)
  }

  // Active APIGateway CORS Setting
  static addOptions(apiRoot: Resource) {
    apiRoot.addMethod("OPTIONS", new MockIntegration({
      integrationResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          "method.response.header.Access-Control-Allow-Origin": "'*'",
          "method.response.header.Access-Control-Allow-Credentials": "'false'",
          "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
        }
      }],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      }
    }), {
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": true,
          "method.response.header.Access-Control-Allow-Origin": true,
          "method.response.header.Access-Control-Allow-Credentials": true,
          "method.response.header.Access-Control-Allow-Methods": true,
        },
        responseModels: {
          "application/json": new EmptyModel()
        },
      }]
    })
  }
}
