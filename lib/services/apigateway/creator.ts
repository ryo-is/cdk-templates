import cdk = require("@aws-cdk/cdk");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");

/**
 * Create APIGateway
 * @param {cdk.Construct} self
 * @param {String} apiName
 * @param {String} apiDescription
 */
export function CreateApiGateway(self: cdk.Construct, apiName: string, apiDescription: string) {
  return new apigateway.RestApi(self, apiName, {
    restApiName: apiName,
    description: apiDescription
  });
}

/**
 * Add Method to APIGateway
 * @param {apigateway.RestApi} api
 * @param {String} method
 * @param {lambda.IFunction} handler
 * @param {Boolean} cors
 */
export function AddMethod(api: apigateway.RestApi, method: string, handler: lambda.IFunction, cors: boolean = true) {
  const integration = new apigateway.LambdaIntegration(handler);
  api.root.addMethod(method, integration);
  if (cors) {
    AddOptions((api.root) as apigateway.Resource);
  }
}

/**
 * Add Resource and Method to APIGateway
 * @param {apigateway.RestApi} api
 * @param {String} resource
 * @param {String} method
 * @param {lambda.IFunction} handler
 * @param {Boolean} cors
 */
export function AddResourceAndMethod(api: apigateway.RestApi, resource: string , method: string, handler: lambda.IFunction, cors: boolean = true) {
  const addResourceApi = api.root.addResource(resource);
  const integration = new apigateway.LambdaIntegration(handler);
  addResourceApi.addMethod(method, integration);
  if (cors) {
    AddOptions(addResourceApi);
  }
}

/**
 * Active APIGateway CORS Setting
 * @param {apigateway.Resource} apiRoot
 */
function AddOptions(apiRoot: apigateway.Resource) {
  const options = apiRoot.addMethod("OPTIONS", new apigateway.MockIntegration({
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
  }));
  const methodResource = (options as cdk.Construct).node.findChild("Resource") as apigateway.CfnMethod;
  methodResource.propertyOverrides.methodResponses = [{
    statusCode: "200",
    responseModels: {
      "application/json": "Empty"
    },
    responseParameters: {
      "method.response.header.Access-Control-Allow-Headers": true,
      "method.response.header.Access-Control-Allow-Origin": true,
      "method.response.header.Access-Control-Allow-Credentials": true,
      "method.response.header.Access-Control-Allow-Methods": true,
    }
  }];
}
