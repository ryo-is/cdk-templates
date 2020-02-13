export type LambdaReturnBody = {
  statusCode: number
  headers: { [k: string]: string }
  body: string
}

export type MessageType = {
  message: string
}
