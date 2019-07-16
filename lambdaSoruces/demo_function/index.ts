import {
  Handler,
  APIGatewayEvent,
  Context,
  Callback
 } from "aws-lambda"

export const handler: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<any> => {
  console.log(JSON.stringify(event))
  const msgBody: string = "SUCCEEDED!!!"
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin" : "*" },
    body: JSON.stringify({ message: msgBody })
  }
}
