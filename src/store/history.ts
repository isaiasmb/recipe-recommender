import type { Meal } from "@/schemas"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Preferences = {
  area: string
  mainIngredient: string
}

export type HistoryItem = {
  meal: Meal
  liked: boolean
  preferences: Preferences
  createdAt: string
}

export type HistoryState = {
  allMeals: HistoryItem[]
  setAllMeals: (allMeals: HistoryItem[]) => void
  likedMeals: HistoryItem[]
  likeMeal: (meal: Meal, preferences: Preferences) => void
  dislikedMeals: HistoryItem[]
  dislikeMeal: (meal: Meal, preferences: Preferences) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      allMeals: [],
      setAllMeals: (allMeals: HistoryItem[]) =>
        set({
          allMeals,
          likedMeals: allMeals.filter((m) => m.liked),
          dislikedMeals: allMeals.filter((m) => !m.liked),
        }),
      likedMeals: [],
      likeMeal: (meal: Meal, preferences: Preferences) => {
        const createdAt = new Date().toISOString()

        return set((state) => ({
          allMeals: [
            { meal, liked: true, preferences, createdAt },
            ...state.allMeals,
          ],
          likedMeals: [
            { meal, liked: true, preferences, createdAt },
            ...state.likedMeals,
          ],
          dislikedMeals: state.dislikedMeals.filter(
            (m) => m.meal.idMeal !== meal.idMeal
          ),
        }))
      },
      dislikedMeals: [],
      dislikeMeal: (meal: Meal, preferences: Preferences) => {
        const createdAt = new Date().toISOString()
        return set((state) => ({
          allMeals: [
            { meal, liked: false, preferences, createdAt },
            ...state.allMeals,
          ],
          dislikedMeals: [
            { meal, liked: false, preferences, createdAt },
            ...state.dislikedMeals,
          ],
          likedMeals: state.likedMeals.filter(
            (m) => m.meal.idMeal !== meal.idMeal
          ),
        }))
      },
    }),
    {
      name: "recommended-meals-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
