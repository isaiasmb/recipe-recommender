import type { Meal } from "@/schemas"
import { create } from "zustand"

export type RecommendedMealsState = {
  recommendedMeals: Meal[]
  setRecommendedMeals: (recommendedMeals: Meal[]) => void
  removeRecommendedMeal: (meal: Meal) => void
}

export const useRecommendedMealsStore = create<RecommendedMealsState>(
  (set) => ({
    recommendedMeals: [],
    setRecommendedMeals: (recommendedMeals: Meal[]) =>
      set({ recommendedMeals }),
    removeRecommendedMeal: (meal: Meal) =>
      set((state) => ({
        recommendedMeals: state.recommendedMeals.filter(
          (m) => m.idMeal !== meal.idMeal
        ),
      })),
  })
)

export default useRecommendedMealsStore
