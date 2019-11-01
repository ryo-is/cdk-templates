import { Handler, APIGatewayEvent } from "aws-lambda"
import { calendar_v3 } from "googleapis"
import keys from "./lib/service_user_keys"
import { JWT } from "google-auth-library"
import * as dayjs from "dayjs"

export const handler: Handler = async (
  event: APIGatewayEvent
): Promise<void> => {
  console.log(JSON.stringify(event))
  const startTime = dayjs()
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss+09:00")
  const endTime = dayjs()
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss+09:00")
  try {
    const jwtClient = new JWT(keys.client_email, "", keys.private_key, [
      "https://www.googleapis.com/auth/calendar"
    ])
    const credentials = await jwtClient.authorize()
    console.log(credentials)

    const carendar = new calendar_v3.Calendar({})
    const calendarList = await carendar.calendarList.list({ auth: jwtClient })
    console.log(calendarList.data.items)
    const events = await carendar.events.list({
      auth: jwtClient,
      calendarId: "ryosuke.izumi62@gmail.com",
      timeMin: startTime,
      timeMax: endTime
    })
    console.log(events.data.items)
  } catch (err) {
    console.error(err)
  }
}
