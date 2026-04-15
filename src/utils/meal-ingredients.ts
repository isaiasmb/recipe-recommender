import type { Meal } from "@/schemas"
import { toTitleCase } from "@/utils/string"

const STR_INGREDIENT_KEY = /^strIngredient(\d+)$/

/** Lowest 1–20 slot where the ingredient matches `mainIngredient` (title-case), or null. */
export function lowestMatchingIngredientSlot(
  meal: Meal,
  mainIngredient: string
): number | null {
  const target = toTitleCase(mainIngredient)
  if (!target) return null

  let best: number | null = null
  for (const key of Object.keys(meal)) {
    const match = STR_INGREDIENT_KEY.exec(key)
    if (!match) continue
    const slot = Number(match[1])
    const raw = meal[key as keyof Meal]
    if (typeof raw !== "string" || !raw.trim()) continue
    if (toTitleCase(raw) !== target) continue
    if (best === null || slot < best) best = slot
  }
  return best
}
