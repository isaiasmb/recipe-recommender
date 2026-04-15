import z from "zod"
import { api } from "./api-client"

const GetMealsResponseSchema = z.object({
  meals: z.array(
    z.object({
      strMeal: z.string(),
      strMealThumb: z.string(),
      idMeal: z.string(),
    })
  ),
})

type GetMealsByAreaResponse = z.infer<typeof GetMealsResponseSchema>

export const getMealsByArea = (area: string) =>
  api(`filter.php?a=${area}`).json<GetMealsByAreaResponse>()
