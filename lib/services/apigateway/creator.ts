import cdk = require("@aws-cdk/core")
import {
  RestApi,
  CfnAuthorizer,
  Resource,
  Method,
  Integration,
  MethodOptions,
  MockIntegration,
  PassthroughBehavior,
  EmptyModel,
  ApiKey,
  UsagePlan
} from "@aws-cdk/aws-apigateway"

export class APIGatewayCreator {
  // Create APIGateway RestApi
  public static createRestApi(
    self: cdk.Construct,
    apiName: string,
    apiDescription: string
  ): RestApi {
    return new RestApi(self, apiName, {
      restApiName: apiName,
      description: apiDescription
    })
  }

  // Create APIGateway Authorizer
  public static createAuthorizer(
    self: cdk.Construct,
    authorizerName: string,
    api: RestApi
  ): CfnAuthorizer {
    return new CfnAuthorizer(self, authorizerName, {
      restApiId: api.restApiId,
      name: authorizerName,
      identitySource: "method.request.header.Authorization",
      providerArns: [""],
      type: "COGNITO_USER_POOLS"
    })
  }

  // Add Resoruce to RestApi Root
  public static addResouceToRestApi(restApi: RestApi, path: string): Resource {
    return restApi.root.addResource(path)
  }

  // Add Method to Resource
  public static addMethodToResource(
    resource: Resource,
    method: string,
    integration: Integration,
    options?: MethodOptions
  ): Method {
    return resource.addMethod(method, integration, options)
  }

  // Active APIGateway CORS Setting
  public static addOptions(apiRoot: Resource): void {
    apiRoot.addMethod(
      "OPTIONS",
      new MockIntegration({
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers":
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
              "method.response.header.Access-Control-Allow-Credentials":
                "'false'",
              "method.response.header.Access-Control-Allow-Methods":
                "'OPTIONS,GET,PUT,POST,DELETE'"
            }
          }
        ],
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: {
          "application/json": '{"statusCode": 200}'
        }
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Credentials": true,
              "method.response.header.Access-Control-Allow-Methods": true
            },
            responseModels: {
              "application/json": new EmptyModel()
            }
          }
        ]
      }
    )
  }

  // Create ApiKey
  private static createApiKey(self: cdk.Construct, keyName: string): ApiKey {
    return new ApiKey(self, keyName, { enabled: true })
  }

  // Create UsagePlan
  public static createUsagePlan(
    self: cdk.Construct,
    planName: string,
    restApi: RestApi
  ): UsagePlan {
    return new UsagePlan(self, planName, {
      throttle: {
        burstLimit: 5000,
        rateLimit: 10000
      },
      apiStages: [
        {
          api: restApi,
          stage: restApi.deploymentStage
        }
      ],
      apiKey: APIGatewayCreator.createApiKey(self, planName + "ApiKey")
    })
  }
}
