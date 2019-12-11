import { MessageType } from "../types"

export class MessageCreator {
  public static create(): MessageType {
    return { message: "SUCCEEDED!!!" }
  }
}
