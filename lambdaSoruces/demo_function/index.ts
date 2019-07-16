import { Handler, APIGatewayEvent, Context, Callback } from "aws-lambda"
import { LambdaReturnBody } from "./types"

export const handler: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<LambdaReturnBody> => {
  console.log(JSON.stringify(event))
  const msgBody: string = "SUCCEEDED!!!"
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin" : "*" },
    body: JSON.stringify({ message: msgBody })
  }
}
