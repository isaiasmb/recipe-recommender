import ky from "ky"

const BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export const api = ky.create({
  prefix: BASE_URL,
})
