export type LambdaReturnBody = {
  statusCode: number
  headers: { [k: string]: string }
  body: string
}
