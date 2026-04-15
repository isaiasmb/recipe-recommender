import type { Meal } from "@/schemas"
import { create } from "zustand"

export type MealsState = {
  meals: Meal[]
  setMeals: (meals: Meal[]) => void
}

export const useMealsStore = create<MealsState>((set) => ({
  meals: [],
  setMeals: (meals: Meal[]) => set({ meals }),
}))

export default useMealsStore
