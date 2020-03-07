import cdk = require("@aws-cdk/core")
import { join } from "path"

import { UserPool } from "@aws-cdk/aws-cognito"
import {
  GraphQLApi,
  FieldLogLevel,
  UserPoolDefaultAction,
  MappingTemplate,
  CfnApiKey,
  PrimaryKey,
  Values
} from "@aws-cdk/aws-appsync"
import {
  TableProps,
  AttributeType,
  BillingMode,
  Table
} from "@aws-cdk/aws-dynamodb"

import { DynamoDBCreator } from "../../services/dynamodb/creator"

const BASE_NAME: string = "CDKHandson"

export class AppSyncStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: "DemoAPIUserPool",
      signInAliases: {
        email: true
      }
    })

    const tableParam: TableProps = {
      tableName: `${BASE_NAME}_TABLE`,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "create_time",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1
    }
    const table: Table = DynamoDBCreator.createTable(this, tableParam)
    const cfnTable = table.node.findChild("Resource") as cdk.CfnResource
    cfnTable.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)

    // const table = Table.fromTableName(
    //   this,
    //   `${BASE_NAME}_TABLE`,
    //   `${BASE_NAME}_TABLE`
    // ) as Table

    const api = new GraphQLApi(this, "GraphQLAPI", {
      name: `${BASE_NAME}_API`,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      authorizationConfig: {
        defaultAuthorization: {
          userPool,
          defaultAction: UserPoolDefaultAction.ALLOW
        }
      },
      schemaDefinitionFile: join(__dirname, "schema.graphql")
    })

    new CfnApiKey(this, "appsyncKey", {
      apiId: api.apiId
    })

    const datasource = api.addDynamoDbDataSource("PostAPIDataSource", "", table)

    datasource.createResolver({
      typeName: "Query",
      fieldName: "all",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    })
    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "save",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id").is("input.id"),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    })
    datasource.createResolver({
      typeName: "Mutation",
      fieldName: "delete",
      requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem("id", "id"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    })

    const queryMappingTemplate = `
      {
        "version": "2017-02-28",
        "operation": "Query",
        "query": {
          "expression": "#id = :id AND #createTime BETWEEN :start AND :end",
          "expressionNames": {
            "#id": "id",
            "#createTime": "create_time"
          },
          "expressionValues": {
            ":id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
            ":start": $util.dynamodb.toDynamoDBJson($ctx.args.start),
            ":end": $util.dynamodb.toDynamoDBJson($ctx.args.end)
          }
        }
      }
    `
    datasource.createResolver({
      typeName: "Query",
      fieldName: "query",
      requestMappingTemplate: MappingTemplate.fromString(queryMappingTemplate),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    })
  }
}
