import { Handler, APIGatewayEvent, Context, Callback } from "aws-lambda"
import { LambdaReturnBody, MessageType } from "./types"

import { MessageCreator } from "./lib/message_cretor"

export const handler: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<LambdaReturnBody> => {
  console.log(JSON.stringify(event))
  const message: MessageType = MessageCreator.create()
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin" : "*" },
    body: JSON.stringify(message)
  }
}
