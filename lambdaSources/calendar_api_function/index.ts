import { DynamoDB } from "aws-sdk/clients/all"
import { Handler } from "aws-lambda"
import { calendar_v3, admin_directory_v1 } from "googleapis"
import keys from "./service_user_keys.json"
import { JWT } from "google-auth-library"
import dayjs from "dayjs"

const DDB = new DynamoDB.DocumentClient()

export const handler: Handler = async (): Promise<void> => {
  const startTime = dayjs()
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss+09:00")
  const endTime = dayjs()
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss+09:00")
  try {
    // CalenderAPIに対する認証
    const calendarJwtClient = new JWT(keys.client_email, "", keys.private_key, [
      "https://www.googleapis.com/auth/calendar"
    ])
    await calendarJwtClient.authorize()
    console.log("auth calendar OK!!!")

    // GSuiteAdminAPIに対する認証
    const adminJwtClient = new JWT(
      keys.client_email,
      "",
      keys.private_key,
      ["https://www.googleapis.com/auth/admin.directory.user"],
      keys.admin_user_address
    )
    await adminJwtClient.authorize()
    console.log("auth GSuite Admin OK!!!")

    // イベント取得
    const carendar = new calendar_v3.Calendar({})
    const events = await carendar.events.list({
      auth: calendarJwtClient,
      calendarId: "kyo_visitor@kyoso.co.jp",
      timeMin: startTime,
      timeMax: endTime
    })

    const admin = new admin_directory_v1.Admin({})

    // 取得したイベントからDDBにPUTするパラメータを生成する
    const usersPromises: any[] = []
    const updateParams: DynamoDB.DocumentClient.UpdateItemInput[] = []
    events.data.items?.forEach((item: calendar_v3.Schema$Event): void => {
      const userKey = item.organizer?.email
      usersPromises.push(
        admin.users.get({
          auth: adminJwtClient,
          userKey: userKey
        })
      )
      const prace =
        item.location === undefined ? "-" : item.location.split("---")[0]
      console.log(prace)

      let praceValue = "-"
      switch (prace) {
        case "KYOSO 京都本社":
          praceValue = "kyoto"
          break
        case "KYOSO 大阪オフィス":
          praceValue = "osaka"
          break
        case "KYOSO 東京オフィス":
          praceValue = "tokyo"
          break
        case "KYOSO 名古屋オフィス":
          praceValue = "nagoya"
          break
        default:
          break
      }
      console.log(praceValue)

      const location =
        item.location === undefined
          ? "-"
          : item.location.split("---")[1].split(" ")[0]
      updateParams.push({
        TableName: "VisitorManagement",
        Key: { id: item.id },
        UpdateExpression:
          "set #prace = :prace, #location = :location, #start_time = :start_time, #end_time = :end_time, #event_summary = :event_summary, #owner_name = :owner_name",
        ExpressionAttributeNames: {
          "#prace": "prace",
          "#location": "location",
          "#start_time": "start_time",
          "#end_time": "end_time",
          "#event_summary": "event_summary",
          "#owner_name": "owner_name"
        },
        ExpressionAttributeValues: {
          ":prace": praceValue,
          ":location": location,
          ":start_time": dayjs(
            (item.start as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          ":end_time": dayjs(
            (item.end as calendar_v3.Schema$EventDateTime).dateTime
          ).format("YYYY/MM/DD HH:mm"),
          ":event_summary": item.summary,
          ":owner_name": "-"
        }
      })
    })

    // ユーザー情報取得
    // eslint-disable-next-line no-undef
    const users = await Promise.all(usersPromises)

    // 取得したユーザー情報とイベントを結合する
    const putPromises: any[] = []
    updateParams.forEach(
      (param: DynamoDB.DocumentClient.UpdateItemInput, index: number) => {
        if (param.ExpressionAttributeValues === undefined) return
        param.ExpressionAttributeValues[":owner_name"] =
          users[index].data.name.fullName
        putPromises.push(DDB.update(param).promise())
      }
    )

    // DynamoDBにPUTする
    // eslint-disable-next-line no-undef
    await Promise.all(putPromises)
  } catch (err) {
    console.error(err)
    throw err
  }
}
