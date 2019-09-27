import { Handler, Context, Callback, CustomAuthorizerEvent } from "aws-lambda"

export const handler: Handler = async (
  event: CustomAuthorizerEvent,
  _context: Context,
  callback: Callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  console.log(JSON.stringify(event))

  if (event.authorizationToken) {
    callback(null, {
      principalId: 1,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn
          }
        ]
      },
      context: {
        messagge: "Custom Allow Message"
      }
    })
  }
  callback(null, {
    principalId: 1,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: event.methodArn
        }
      ]
    },
    context: {
      messagge: "Custom Error Message"
    }
  })
}
