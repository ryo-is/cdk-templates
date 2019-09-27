import { Handler, Context, Callback, CustomAuthorizerEvent } from "aws-lambda"

export const handler: Handler = async (
  event: CustomAuthorizerEvent,
  _context: Context,
  callback: Callback
): Promise<any> => {
  console.log(JSON.stringify(event))

  if (event.authorizationToken === "allow") {
    callback(null, {
      principalId : 1,
      policyDocument : {
        Version : "2012-10-17",
        Statement : [
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
    principalId : 1,
    policyDocument : {
      Version : "2012-10-17",
      Statement : [
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
