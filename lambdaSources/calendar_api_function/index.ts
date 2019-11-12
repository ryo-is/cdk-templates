import { DynamoDB } from "aws-sdk/clients/all"
import { Handler, APIGatewayEvent } from "aws-lambda"
import { calendar_v3, admin_directory_v1 } from "googleapis"
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
    const calendarJwtClient = new JWT(keys.client_email, "", keys.private_key, [
      "https://www.googleapis.com/auth/calendar"
    ])
    const calendarCredential = await calendarJwtClient.authorize()
    console.log(calendarCredential)

    const adminJwtClient = new JWT(
      keys.client_email,
      "",
      keys.private_key,
      ["https://www.googleapis.com/auth/admin.directory.user"],
      keys.admin_user_address
    )
    const adminCredential = await adminJwtClient.authorize()
    console.log(adminCredential)

    const carendar = new calendar_v3.Calendar({})
    const events = await carendar.events.list({
      auth: calendarJwtClient,
      calendarId: "kyo_visitor@kyoso.co.jp",
      timeMin: startTime,
      timeMax: endTime
    })
    console.log(events.data.items)

    const admin = new admin_directory_v1.Admin({})

    const usersPromises: any[] = []
    const putParams: DynamoDB.DocumentClient.PutItemInput[] = []
    events.data.items?.forEach((item: calendar_v3.Schema$Event): void => {
      const userKey = item.organizer?.email
      usersPromises.push(
        admin.users.get({
          auth: adminJwtClient,
          userKey: userKey
        })
      )
      putParams.push({
        TableName: "VisitorManagement",
        Item: {
          id: item.id,
          prace: "kyoto",
          location: item.location?.split("---")[1].split(" ")[0],
          start_time: dayjs(
            (item.start as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          end_time: dayjs(
            (item.end as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          event_summary: item.summary
        }
      })
    })

    // eslint-disable-next-line no-undef
    const users = await Promise.all(usersPromises)

    const putPromises: any[] = []
    putParams.forEach(
      (param: DynamoDB.DocumentClient.PutItemInput, index: number) => {
        param.Item["owner_name"] = users[index].data.name.fullName
        putPromises.push(DDB.put(param).promise())
      }
    )

    // eslint-disable-next-line no-undef
    await Promise.all(putPromises)
  } catch (err) {
    console.error(err)
  }
}
