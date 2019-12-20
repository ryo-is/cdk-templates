import { Handler } from "aws-lambda"
import { createClient } from "@google/maps"
import keyJSON from "./api_key.json"

type Event = {
  lat: number
  lng: number
}

export const handler: Handler = async (event: Event): Promise<void> => {
  const googleMapsClient = createClient({
    key: keyJSON.key,
    Promise: Promise // eslint-disable-line
  })
  const geocode = await googleMapsClient
    .reverseGeocode({
      latlng: [event.lat, event.lng],
      language: "ja"
    })
    .asPromise()
  console.log(JSON.stringify(geocode.json))
}
