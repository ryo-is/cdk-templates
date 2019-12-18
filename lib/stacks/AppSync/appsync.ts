import cdk = require("@aws-cdk/core")
import { join } from "path"

// import { UserPool, SignInType } from "@aws-cdk/aws-cognito"
import {
  GraphQLApi,
  FieldLogLevel,
  // UserPoolDefaultAction,
  MappingTemplate,
  CfnApiKey
} from "@aws-cdk/aws-appsync"
import { TableProps, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb"

import { DynamoDBCreator } from "../../services/dynamodb/creator"

export class AppSyncStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // const userPool = new UserPool(this, "UserPool", {
    //   userPoolName: "DemoAPIUserPool",
    //   signInType: SignInType.USERNAME
    // })

    const tableParam: TableProps = {
      tableName: "CDKPostTable",
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
    const table = DynamoDBCreator.createTable(this, tableParam)

    const api = new GraphQLApi(this, "PostAPI", {
      name: "PostAPI",
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      // userPoolConfig: {
      //   userPool,
      //   defaultAction: UserPoolDefaultAction.ALLOW
      // },
      schemaDefinitionFile: join(__dirname, "schema.graphql")
    })

    new CfnApiKey(this, "PostAPIKey", {
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
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem("id", "input"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    })

    const queryMappingTemplate = `
      {
        "version": "2017-02-28",
        "operation": "Query",
        "query": {
          "expression": "#id = :id AND #createTime BETWEEN :start AND :end",
          "expressionNames": {
            "#id": "id"
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
