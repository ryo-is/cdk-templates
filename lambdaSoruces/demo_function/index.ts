import {
  Handler,
  APIGatewayEvent,
  Context,
  Callback
 } from "aws-lambda"

export const handler: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
  callback: Callback
): Promise<void> => {
  console.log(JSON.stringify(event))
  callback(null, {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin" : "*" },
    body: JSON.stringify({message: "SUCCEEDED!"})
  })
}
