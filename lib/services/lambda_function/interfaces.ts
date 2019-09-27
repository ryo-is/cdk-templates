export interface CreatingLambdaFunctionParams {
  nameValue: string
  codeDirectory: string
  handlerValue?: string
  memorySizeValue?: number
  timeoutValue?: number
  description?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  environment?: { [k: string]: any }
}
