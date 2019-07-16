import cdk = require("@aws-cdk/core")
import { Table, TableProps, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb"
import { Role, ManagedPolicy } from "@aws-cdk/aws-iam"
import {
  CfnGraphQLApi,
  CfnDataSource,
  CfnGraphQLSchema,
  CfnResolver
} from "@aws-cdk/aws-appsync"

import { DynamoDBCreator } from "../services/dynamodb/creator"
import { IAMCreator } from "../services/iam/creator"
import { AppSyncCreator } from "../services/appsync/creator"

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
      billingMode: BillingMode.PAY_PER_REQUEST
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)

    const tableRole: Role = IAMCreator.createAppSyncServiceRole(this, "CDKAppSyncServiceRole")
    tableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"))

    const graphqlAPI: CfnGraphQLApi = AppSyncCreator.createGrapphQLAPI(this, "CDKAppSyncAPI")
    AppSyncCreator.createAPIKey(this, "CreateAPIKey", graphqlAPI)

    const definition: string = `
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

    const apiSchema: CfnGraphQLSchema = AppSyncCreator.createApiSchema(this, "CDKGraphQLSchema", graphqlAPI, definition)
    const dataSource: CfnDataSource = AppSyncCreator.createDataSource(
      this,
      "CDKDataSourse",
      graphqlAPI,
      this.region,
      table.tableName,
      tableRole.roleArn
    )

    const getOneResolverMappingTemplate: string = `
      {
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }
    `
    const getOneResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      "GetOneQueryResolver",
      graphqlAPI,
      "Query",
      "getOne",
      dataSource,
      getOneResolverMappingTemplate
    )
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
    const getAllResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      "GetAllQueryResolver",
      graphqlAPI,
      "Query",
      "all",
      dataSource,
      getAllResolverMappingTemplate
    )
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
    const saveResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      "SaveMutationResolver",
      graphqlAPI,
      "Mutation",
      "save",
      dataSource,
      saveResolverMappingTemplate
    )
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
    const deleteResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      "DeleteMutationResolver",
      graphqlAPI,
      "Mutation",
      "delete",
      dataSource,
      deleteResolverMappingTemplate
    )
    deleteResolver.addDependsOn(apiSchema)
    deleteResolver.addDependsOn(dataSource)
  }
}
