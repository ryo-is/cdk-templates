export type RestApiParam = {
  apiName: string
  apiDescription: string
  auth?: "API_KEY" | "COGNITO"
  planName?: string
  authorizerName?: string
  providerArns?: string[]
}

export type RestApiResouseParam = {
  path: string
  cors: boolean
  lambdaParams: LambdaParam[]
}

export type LambdaParam = {
  nameValue: string
  codeDirectory: string
  handlerValue?: string
  memorySizeValue?: number
  timeoutValue?: number
  description?: string
  environment?: { [k: string]: any }
  method: string
}
