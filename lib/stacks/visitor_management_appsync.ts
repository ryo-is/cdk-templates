import cdk = require("@aws-cdk/core")
import {
  Table,
  TableProps,
  AttributeType,
  BillingMode
} from "@aws-cdk/aws-dynamodb"
import { Role, PolicyStatement } from "@aws-cdk/aws-iam"
import {
  CfnGraphQLApi,
  CfnDataSource,
  CfnGraphQLSchema,
  CfnResolver
} from "@aws-cdk/aws-appsync"

import { DynamoDBCreator } from "../services/dynamodb/creator"
import { IAMCreator } from "../services/iam/creator"
import { AppSyncCreator } from "../services/appsync/creator"

export class VisitorManagementAppsync extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tableName: string = "VisitorManagement"
    const indexName: string = "prace-start_time-index"
    const tableParam: TableProps = {
      tableName: tableName,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      writeCapacity: 1,
      readCapacity: 1
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)

    table.addGlobalSecondaryIndex({
      indexName: `${indexName}`,
      partitionKey: {
        name: "prace",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "start_time",
        type: AttributeType.STRING
      },
      readCapacity: 1,
      writeCapacity: 1
    })

    const tableRole: Role = IAMCreator.createAppSyncServiceRole(
      this,
      "VisitorManagementAppsyncRole"
    )
    const policyStatement: PolicyStatement = IAMCreator.createRoleStatement(
      [
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      [table.tableArn, `${table.tableArn}/index/${indexName}`]
    )
    tableRole.addToPolicy(policyStatement)

    const tableResouce = table.node.findChild("Resource") as cdk.CfnResource
    tableResouce.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)

    const graphqlAPI: CfnGraphQLApi = AppSyncCreator.createCognitoAuthGraphQLAPI(
      this,
      "VisitorManagementAPI"
    )

    const definition = `
      type ${tableName} {
        id: ID!
        prace: String!,
        start_time: String!,
        end_time: String,
        entry_time: String,
        exit_time: String,
        event_summary: String,
        batch_numbers: [String]
      }
      input Input${tableName} {
        id: ID!
        prace: String!,
        start_time: String!,
        end_time: String,
        entry_time: String,
        exit_time: String,
        event_summary: String,
        batch_numbers: [String]
      }
      type Paginated${tableName} {
        items: [${tableName}!]!
        nextToken: String
      }
      type Query {
        query(prace: String!, day_start: String!, day_end: String!): Paginated${tableName}!
      }
      type Mutation {
        put(input: Input${tableName}!): ${tableName}
      }
    `

    const apiSchema: CfnGraphQLSchema = AppSyncCreator.createApiSchema(
      this,
      `${tableName}GraphQLSchema`,
      graphqlAPI,
      definition
    )
    const dataSource: CfnDataSource = AppSyncCreator.createDataSource(
      this,
      `${tableName}DataSource`,
      graphqlAPI,
      this.region,
      table.tableName,
      tableRole.roleArn
    )

    const queryMappingTemplate = `
      {
        "version": "2017-02-28",
        "operation": "Query",
        "index": "${indexName}",
        "query": {
          "expression": "#prace = :prace AND #startTime BETWEEN :dayStart AND :dayDnd",
          "expressionNames": {
              "#prace": "prace",
              "#startTime": "start_time"
          },
          "expressionValues": {
              ":prace": $util.dynamodb.toDynamoDBJson($ctx.args.prace),
              ":dayStart": $util.dynamodb.toDynamoDBJson($ctx.args.day_start),
              ":dayDnd": $util.dynamodb.toDynamoDBJson($ctx.args.day_end)
          }
        }
      }
    `
    const queryResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      `queryResolver`,
      graphqlAPI,
      "Query",
      "query",
      dataSource,
      queryMappingTemplate
    )
    queryResolver.addDependsOn(apiSchema)
    queryResolver.addDependsOn(dataSource)

    const putMappingTemplate = `
      {
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input)
      }
    `
    const putResolver: CfnResolver = AppSyncCreator.createResolver(
      this,
      `putResolver`,
      graphqlAPI,
      "Mutation",
      "put",
      dataSource,
      putMappingTemplate
    )
    putResolver.addDependsOn(apiSchema)
    putResolver.addDependsOn(dataSource)
  }
}
