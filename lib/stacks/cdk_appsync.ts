import cdk = require("@aws-cdk/core")
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb"
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam"
import {
  CfnGraphQLApi,
  CfnDataSource,
  CfnApiKey,
  CfnGraphQLSchema,
  CfnResolver
} from "@aws-cdk/aws-appsync"

export class CdkAppSync extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const tableName: string = "CDKAppSyncTable"

    const table: Table = new Table(this, tableName, {
      tableName: tableName,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    })

    const tableRole: Role = new Role(this, "CDKTableRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com")
    })
    tableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"))

    const graphqlAPI: CfnGraphQLApi = new CfnGraphQLApi(this, "CDKAppSyncAPI", {
      authenticationType: "API_KEY",
      name: "CDKAppSyncAPI"
    })

    new CfnApiKey(this, "CreateAPIKey", {
      apiId: graphqlAPI.attrApiId
    })

    const apiSchema: CfnGraphQLSchema = new CfnGraphQLSchema(this, "CDKGraphQLSchema", {
      apiId: graphqlAPI.attrApiId,
      definition: `
        type ${tableName} {
          id: ID!,
          name: String
        }
        type Paginated${tableName} {
          items: [${tableName}!]!
          nextToken: String
        }
        type Query {
          all(limit: Int, nextToken: String): Paginated${tableName}!
          getOne(id: ID!): ${tableName}
        }
        type Mutation {
          save(name: String!): ${tableName}
          delete(id: ID!): ${tableName}
        }
        type Schema {
          query: Query
          mutation: Mutation
        }
      `,
    })

    const dataSource: CfnDataSource = new CfnDataSource(this, "CDKDataSourse", {
      apiId: graphqlAPI.attrApiId,
      name: "CDKDataSourse",
      type: "AMAZON_DYNAMODB",
      dynamoDbConfig: {
        awsRegion: this.region,
        tableName: table.tableName
      },
      serviceRoleArn: tableRole.roleArn
    })

    const getOneResolver = new CfnResolver(this, "GetOneQueryResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Query",
      fieldName: "getOne",
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    getOneResolver.addDependsOn(apiSchema)
    getOneResolver.addDependsOn(dataSource)

    const getAllResolver = new CfnResolver(this, "GetAllQueryResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Query",
      fieldName: "all",
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "Scan",
        "limit": $util.defaultIfNull($ctx.args.limit, 20),
        "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null))
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    getAllResolver.addDependsOn(apiSchema)
    getAllResolver.addDependsOn(dataSource)

    const saveResolver = new CfnResolver(this, "SaveMutationResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "save",
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "id": { "S": "$util.autoId()" }
        },
        "attributeValues": {
          "name": $util.dynamodb.toDynamoDBJson($ctx.args.name)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    saveResolver.addDependsOn(apiSchema)
    saveResolver.addDependsOn(dataSource)

    const deleteResolver = new CfnResolver(this, "DeleteMutationResolver", {
      apiId: graphqlAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "delete",
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "DeleteItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    })
    deleteResolver.addDependsOn(apiSchema)
    deleteResolver.addDependsOn(dataSource)
  }
}
