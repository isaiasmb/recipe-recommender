import { useCallback } from "react"
import type { Meal } from "@/schemas"
import { useHistoryStore } from "@/store/history"
import useRecommendedMealsStore from "@/store/recommended-meals"
import { useFormContext } from "../formContext"

export const useHistory = () => {
  const { form } = useFormContext()
  const { likeMeal, dislikeMeal } = useHistoryStore()
  const { removeRecommendedMeal } = useRecommendedMealsStore()

  const area = form.getFieldValue("area")
  const mainIngredient = form.getFieldValue("mainIngredient")

  const like = useCallback((meal: Meal) => {
    likeMeal(meal, {
      area,
      mainIngredient,
    })
    removeRecommendedMeal(meal)
  }, [])

  const dislike = useCallback((meal: Meal) => {
    dislikeMeal(meal, {
      area,
      mainIngredient,
    })
    removeRecommendedMeal(meal)
  }, [])

  return {
    like,
    dislike,
  }
}
