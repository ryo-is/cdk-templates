import cdk = require("@aws-cdk/core")
import { Table, TableProps, AttributeType } from "@aws-cdk/aws-dynamodb"
import { Role, ManagedPolicy, ServicePrincipal } from "@aws-cdk/aws-iam"
import {
  CfnGraphQLApi,
  CfnDataSource,
  CfnGraphQLSchema,
  CfnResolver,
  CfnApiKey
} from "@aws-cdk/aws-appsync"

export class CdkAppSync extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tableNameValue: string = "CDKAppSyncTable"
    const tableParam: TableProps = {
      tableName: tableNameValue,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      readCapacity: 2,
      writeCapacity: 2
    }
    // Create DynamoDB Table
    new Table(this, tableNameValue, tableParam)

    const tableRole: Role = new Role(this, "CdkAppSyncServiceRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com")
    })
    tableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"))

    // Create GraphQL API
    const graphqlAPI: CfnGraphQLApi = new CfnGraphQLApi(this, "CDKAppSyncAPI", {
      authenticationType: "API_KEY",
      name: "CDKAppSyncAPI"
    })
    // Create API Key
    new CfnApiKey(this, "CreateAPIKey", {
      apiId: graphqlAPI.attrApiId
    })

    const definitionString: string = `
      type ${tableNameValue} {
        id: ID!,
        name: String
      }
      type Paginated${tableNameValue} {
        items: [${tableNameValue}!]!
        nextToken: String
      }
      type Query {
        all(limit: Int, nextToken: String): Paginated${tableNameValue}!
        getOne(id: ID!): ${tableNameValue}
      }
      type Mutation {
        save(name: String!): ${tableNameValue}
        delete(id: ID!): ${tableNameValue}
      }
      type Schema {
        query: Query
        mutation: Mutation
      }
    `
    // Create Schema
    const apiSchema: CfnGraphQLSchema = new CfnGraphQLSchema(this, "CDKGraphQLSchema", {
      apiId: graphqlAPI.attrApiId,
      definition: definitionString
    })

    // Create DataSource
    const dataSource: CfnDataSource = new CfnDataSource(this, "CDKDataSourse", {
      apiId: graphqlAPI.attrApiId,
      name: tableNameValue,
      type: "AMAZON_DYNAMODB",
      dynamoDbConfig: {
        awsRegion: this.region,
        tableName: tableNameValue
      },
      serviceRoleArn: tableRole.roleArn
    })

    const getOneResolverMappingTemplate: string = `
      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }
    `
    // Create Get Resolver
    const getOneResolver: CfnResolver = new CfnResolver(this, "GetOneQueryResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Query",
      fieldName: "getOne",
      dataSourceName: dataSource.name,
      requestMappingTemplate: getOneResolverMappingTemplate,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    getOneResolver.addDependsOn(apiSchema)
    getOneResolver.addDependsOn(dataSource)

    const getAllResolverMappingTemplate: string = `
      {
        "version": "2017-02-28",
        "operation": "Scan",
        "limit": $util.defaultIfNull($ctx.args.limit, 20),
        "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null))
      }
    `
    // Create Scan Resolver
    const getAllResolver: CfnResolver = new CfnResolver(this, "GetAllQueryResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Query",
      fieldName: "all",
      dataSourceName: dataSource.name,
      requestMappingTemplate: getAllResolverMappingTemplate,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    getAllResolver.addDependsOn(apiSchema)
    getAllResolver.addDependsOn(dataSource)

    const saveResolverMappingTemplate: string = `
      {
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "id": { "S": "$util.autoId()" }
        },
        "attributeValues": {
          "name": $util.dynamodb.toDynamoDBJson($ctx.args.name)
        }
      }
    `
    // Create Put Resolver
    const saveResolver: CfnResolver = new CfnResolver(this, "SaveMutationResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "save",
      dataSourceName: dataSource.name,
      requestMappingTemplate: saveResolverMappingTemplate,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    saveResolver.addDependsOn(apiSchema)
    saveResolver.addDependsOn(dataSource)

    const deleteResolverMappingTemplate: string = `
      {
        "version": "2017-02-28",
        "operation": "DeleteItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }
    `
    // Create Delete Resolver
    const deleteResolver: CfnResolver = new CfnResolver(this, "DeleteMutationResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "delete",
      dataSourceName: dataSource.name,
      requestMappingTemplate: deleteResolverMappingTemplate,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    deleteResolver.addDependsOn(apiSchema)
    deleteResolver.addDependsOn(dataSource)
  }
}
