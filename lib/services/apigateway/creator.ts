import cdk = require("@aws-cdk/cdk");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import cognitoArn = require("../cognito/cognito_arn");

export class APIGatewayCreator {
  /**
   * Create APIGateway
   * @param {cdk.Construct} self
   * @param {String} apiName
   * @param {String} apiDescription
   */
  static CreateApiGateway(self: cdk.Construct, apiName: string, apiDescription: string) {
    return new apigateway.RestApi(self, apiName, {
      restApiName: apiName,
      description: apiDescription
    });
  }

  /**
   * Create APIGateway Authorizer
   * @param {cdk.Construct} self
   * @param {String} authorizerName
   * @param {apigateway.RestApi} api
   */
  static CreateAuthorizer(self: cdk.Construct, authorizerName: string, api: apigateway.RestApi) {
    return new apigateway.CfnAuthorizer(self, authorizerName, {
      restApiId: api.restApiId,
      name: authorizerName,
      identitySource: "method.request.header.Authorization",
      providerArns: [cognitoArn.default.arn],
      type: "COGNITO_USER_POOLS"
    });
  }

  /**
   * Add Method to APIGateway
   * @param {apigateway.RestApi} api
   * @param {String} method
   * @param {lambda.IFunction} handler
   * @param {apigateway.CfnAuthorizer} authorizer
   * @param {Boolean} cors
   */
  static AddMethod(
    api: apigateway.RestApi,
    method: string,
    handler: lambda.IFunction,
    authorizer: apigateway.CfnAuthorizer,
    cors: boolean = true) {
    const integration = new apigateway.LambdaIntegration(handler);
    const option: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.Cognito,
      authorizerId: authorizer.authorizerId
    }
    api.root.addMethod(method, integration, option);
    if (cors) {
      APIGatewayCreator.AddOptions((api.root) as apigateway.Resource);
    }
  }

  /**
   * Add Resource and Method to APIGateway
   * @param {apigateway.RestApi} api
   * @param {String} resource
   * @param {String} method
   * @param {lambda.IFunction} handler
   * @param {apigateway.CfnAuthorizer} authorizer
   * @param {Boolean} cors
   */
  static AddResourceAndMethod(
    api: apigateway.RestApi,
    resource: string,
    method: string,
    handler: lambda.IFunction,
    authorizer: apigateway.CfnAuthorizer,
    cors: boolean = true) {
    const addResourceApi = api.root.addResource(resource);
    const integration = new apigateway.LambdaIntegration(handler);
    const option: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.Cognito,
      authorizerId: authorizer.authorizerId
    }
    addResourceApi.addMethod(method, integration, option);
    if (cors) {
      APIGatewayCreator.AddOptions(addResourceApi);
    }
  }

  /**
   * Active APIGateway CORS Setting
   * @param {apigateway.Resource} apiRoot
   */
  private static AddOptions(apiRoot: apigateway.Resource) {
    apiRoot.addMethod("OPTIONS", new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          "method.response.header.Access-Control-Allow-Origin": "'*'",
          "method.response.header.Access-Control-Allow-Credentials": "'false'",
          "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.Never,
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
          "application/json": new apigateway.EmptyModel()
        },
      }]
    });
  }
}
