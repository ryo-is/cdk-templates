import cdk = require("@aws-cdk/core")
import {
  CfnGraphQLApi,
  CfnApiKey,
  CfnGraphQLSchema,
  CfnDataSource,
  CfnResolver
} from "@aws-cdk/aws-appsync"

export class AppSyncCreator {
  // Create GraphQL API
  public static createGrapphQLAPI(
    self: cdk.Construct,
    APIName: string,
    authType: string = "API_KEY"
  ): CfnGraphQLApi {
    return new CfnGraphQLApi(self, APIName, {
      authenticationType: authType,
      name: APIName
    })
  }

  public static createCognitoAuthGraphQLAPI(
    self: cdk.Construct,
    name: string
  ): CfnGraphQLApi {
    return new CfnGraphQLApi(self, name, {
      authenticationType: "AMAZON_COGNITO_USER_POOLS",
      name: name,
      userPoolConfig: {
        awsRegion: "ap-northeast-1",
        defaultAction: "ALLOW",
        userPoolId: "ap-northeast-1_tqGpIfXKu"
      }
    })
  }

  // Create API Key
  public static createAPIKey(
    self: cdk.Construct,
    keyName: string,
    graphqlAPI: CfnGraphQLApi
  ): CfnApiKey {
    return new CfnApiKey(self, keyName, {
      apiId: graphqlAPI.attrApiId
    })
  }

  // Create Schema
  public static createApiSchema(
    self: cdk.Construct,
    schemaName: string,
    graphqlAPI: CfnGraphQLApi,
    definitionBody: string
  ): CfnGraphQLSchema {
    return new CfnGraphQLSchema(self, schemaName, {
      apiId: graphqlAPI.attrApiId,
      definition: definitionBody
    })
  }

  // Create DataSource
  public static createDataSource(
    self: cdk.Construct,
    dataSourceName: string,
    graphqlAPI: CfnGraphQLApi,
    region: string,
    tableNameValue: string,
    roleArn: string
  ): CfnDataSource {
    return new CfnDataSource(self, "CDKDataSourse", {
      apiId: graphqlAPI.attrApiId,
      name: dataSourceName,
      type: "AMAZON_DYNAMODB",
      dynamoDbConfig: {
        awsRegion: region,
        tableName: tableNameValue
      },
      serviceRoleArn: roleArn
    })
  }

  // Create Resolver
  public static createResolver(
    self: cdk.Construct,
    resolverName: string,
    graphqlAPI: CfnGraphQLApi,
    type: string,
    field: string,
    dataSource: CfnDataSource,
    mappingTemplate: string
  ): CfnResolver {
    return new CfnResolver(self, resolverName, {
      apiId: graphqlAPI.attrApiId,
      typeName: type,
      fieldName: field,
      dataSourceName: dataSource.name,
      requestMappingTemplate: mappingTemplate,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
  }
}
