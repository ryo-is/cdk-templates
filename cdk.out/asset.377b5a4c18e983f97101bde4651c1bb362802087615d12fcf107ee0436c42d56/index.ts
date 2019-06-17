import { Handler, APIGatewayEvent } from "aws-lambda"

export const handler: Handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success!!!",
      input: event,
    }),
  };
}
