import { useMemo } from "react"
import { useFormContext } from "../formContext"
import { useHistoryStore } from "@/store/history"
import useMealsStore from "@/store/meals"
import { lowestMatchingIngredientSlot } from "@/utils/meal-ingredients"

/**
 * @description Find meals that match the area and main ingredient.
 * Excludes meals already present in history (liked or disliked).
 * Returns a list of meals sorted by the lowest matching ingredient slot.
 * */
export const useRecommendedMeals = () => {
  const { form } = useFormContext()

  const area = form.getFieldValue("area")
  const mainIngredient = form.getFieldValue("mainIngredient")
  const { meals } = useMealsStore()
  const allMeals = useHistoryStore((s) => s.allMeals)

  const recommendedMeals = useMemo(() => {
    if (!area || !String(mainIngredient ?? "").trim()) {
      return []
    }

    const historyMealIds = new Set(allMeals.map((item) => item.meal.idMeal))

    const ranked = meals
      .filter((meal) => meal.strArea === area)
      .filter((meal) => !historyMealIds.has(meal.idMeal))
      .map((meal) => ({
        meal,
        slot: lowestMatchingIngredientSlot(meal, mainIngredient),
      }))
      .filter(
        (row): row is { meal: (typeof meals)[number]; slot: number } =>
          row.slot !== null
      )
      .sort((a, b) => {
        if (a.slot !== b.slot) return a.slot - b.slot
        return a.meal.strMeal.localeCompare(b.meal.strMeal)
      })

    return ranked.map((r) => r.meal)
  }, [area, mainIngredient, meals, allMeals])

  return recommendedMeals
}
