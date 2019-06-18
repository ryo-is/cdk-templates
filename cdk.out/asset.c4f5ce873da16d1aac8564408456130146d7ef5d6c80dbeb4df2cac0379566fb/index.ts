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
) => {
  console.log(JSON.stringify(event))
  // return {
  //   statusCode: 200,
  //   body: {
  //     message: "Success!!!",
  //     input: JSON.stringify(event)
  //   },
  //   handlers: {
  //     "Access-Control-Allow-Origin": "*"
  //   }
  // }
  callback(null, {
    statusCode: 200,
    body: {
      message: "Success!!!",
      input: JSON.stringify(event)
    },
    handlers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
}
