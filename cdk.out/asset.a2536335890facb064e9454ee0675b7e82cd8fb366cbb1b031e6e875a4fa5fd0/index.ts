import { Handler, APIGatewayEvent } from "aws-lambda"

export const handler: Handler = async (event: APIGatewayEvent) => {
  console.log(JSON.stringify(event))
  return {
    statusCode: 200,
    body: {
      message: "Success!!!",
      input: JSON.stringify(event),
      handlers: {
        "Access-Control-Allow-Origin": "*"
      }
    },
  };
}
