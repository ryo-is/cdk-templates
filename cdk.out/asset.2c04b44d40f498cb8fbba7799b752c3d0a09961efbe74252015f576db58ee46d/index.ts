import { Handler, APIGatewayEvent } from "aws-lambda"

export const handler: Handler = async (event: APIGatewayEvent) => {
  console.log(JSON.stringify(event))
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success!!!",
      input: event,
      handlers: {
        "Access-Control-Allow-Origin": "*"
      }
    }),
  };
}
