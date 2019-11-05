import { DynamoDB } from "aws-sdk/clients/all"
import { Handler, APIGatewayEvent } from "aws-lambda"
import { calendar_v3 } from "googleapis"
import keys from "./lib/service_user_keys"
import { JWT } from "google-auth-library"
import * as dayjs from "dayjs"

const DDB = new DynamoDB.DocumentClient()

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
    const events = await carendar.events.list({
      auth: jwtClient,
      calendarId: "kyo_visitor@kyoso.co.jp",
      timeMin: startTime,
      timeMax: endTime
    })
    console.log(events.data.items)

    if (events.data.items === undefined) return

    const promises: any[] = []
    events.data.items.forEach((item: calendar_v3.Schema$Event) => {
      const param: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "VisitorManagement",
        Item: {
          id: item.id,
          prace: "kyoto",
          location: item.location,
          start_time: dayjs(
            (item.start as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          end_time: dayjs(
            (item.end as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          event_summary: item.summary
        }
      }
      console.log(param)
      promises.push(DDB.put(param).promise())
    })

    // eslint-disable-next-line no-undef
    await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }
}
