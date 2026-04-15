import { z } from "zod"

/** Validated index route search: area, main ingredient, wizard step. */
export const recipeSearchSchema = z.object({
  area: z.string().default(""),
  mainIngredient: z.string().default(""),
  step: z.coerce.number().int().min(1).max(3).default(1),
})

export type RecipeSearch = z.infer<typeof recipeSearchSchema>
