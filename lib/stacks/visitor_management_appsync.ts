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
    const tableParam: TableProps = {
      tableName: tableName,
      partitionKey: {
        name: "prace",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "create_time",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      writeCapacity: 1,
      readCapacity: 1
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)

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
      [table.tableArn]
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
        prace: String!,
        create_time: String,
        entry_time: String,
        exit_time: String,
        company_name: String,
        name: String,
        total_number_of_people: Int,
        batch_numbers: [String]
      }
      input Input${tableName} {
        prace: String!,
        create_time: String,
        entry_time: String,
        exit_time: String,
        company_name: String,
        name: String,
        total_number_of_people: Int,
        batch_numbers: [String]
      }
      type Paginated${tableName} {
        items: [${tableName}!]!
        nextToken: String
      }
      type Query {
        query(prace: String!, start_time: String!, end_time: String!): Paginated${tableName}!
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
        "query": {
            "expression": "#prace = :prace AND #createTime BETWEEN :startTime AND :endTime",
            "expressionNames": {
                "#prace": "prace",
                "#createTime": "create_time"
            },
            "expressionValues": {
                ":prace": $util.dynamodb.toDynamoDBJson($ctx.args.prace),
                ":startTime": $util.dynamodb.toDynamoDBJson($ctx.args.start_time),
                ":endTime": $util.dynamodb.toDynamoDBJson($ctx.args.end_time)
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
          "prace": $util.dynamodb.toDynamoDBJson($ctx.args.input.prace),
          "create_time": $util.dynamodb.toDynamoDBJson($ctx.args.input.create_time)
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
