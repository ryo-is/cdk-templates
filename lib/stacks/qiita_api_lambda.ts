import cdk = require("@aws-cdk/core")
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda"
import { RestApi, Integration, LambdaIntegration, Resource,
  MockIntegration, PassthroughBehavior, EmptyModel } from "@aws-cdk/aws-apigateway"

export class QiitaAPILambda extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Lambda Function 作成
    const lambdaFunction: Function = new Function(this, "qiita_demo", {
      functionName: "qiita_demo", // 関数名
      runtime: Runtime.NODEJS_10_X, // ランタイムの指定
      code: Code.asset("lambdaSources/demo_function"), // ソースコードのディレクトリ
      handler: "index.handler", // handler の指定
      memorySize: 256, // メモリーの指定
      timeout: cdk.Duration.seconds(10), // タイムアウト時間
      environment: {} // 環境変数
    })

    // API Gateway 作成
    const restApi: RestApi = new RestApi(this, "QiitaDemoAPI", {
      restApiName: "QiitaDemoAPI", // API名
      description: "Deployed by CDK" // 説明
    })

    // Integration 作成
    const integration: Integration = new LambdaIntegration(lambdaFunction)

    // リソースの作成
    const getResouse: Resource = restApi.root.addResource("get")

    // メソッドの作成
    getResouse.addMethod("GET", integration)

    // CORS対策でOPTIONSメソッドを作成
    getResouse.addMethod("OPTIONS", new MockIntegration({
      integrationResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
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
