export type RestApiParam = {
  apiName: string
  apiDescription: string
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
  path: string
  cors: boolean
}
