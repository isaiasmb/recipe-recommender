import z from "zod"
import { api } from "./api-client"

const GetAreasResponseSchema = z.object({
  meals: z.array(
    z.object({
      strArea: z.string(),
    })
  ),
})

type GetAreasResponse = z.infer<typeof GetAreasResponseSchema>

export const getAreas = () => api("list.php?a=list").json<GetAreasResponse>()
