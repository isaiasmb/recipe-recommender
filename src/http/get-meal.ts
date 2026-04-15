import z from "zod"
import { api } from "./api-client"
import { MealSchema } from "@/schemas"

const GetMealResponseSchema = z.object({
  meals: z.array(MealSchema),
})

type GetMealResponse = z.infer<typeof GetMealResponseSchema>

export const getMealById = (id: string) =>
  api(`lookup.php?i=${id}`).json<GetMealResponse>()
