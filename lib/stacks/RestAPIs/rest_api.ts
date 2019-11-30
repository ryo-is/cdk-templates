import cdk = require("@aws-cdk/core")

import { RestApi } from "@aws-cdk/aws-apigateway"
import { APIGatewayCreator } from "../../services/apigateway/creator"

export class RestAPIStack extends cdk.Stack {
  public RestAPI: RestApi

  constructor(
    scope: cdk.App,
    id: string,
    param: { [k: string]: string },
    props?: cdk.StackProps
  ) {
    super(scope, id, props)

    this.RestAPI = APIGatewayCreator.createRestApi(
      this,
      param.apiName,
      param.apiDescription
    )
  }
}
