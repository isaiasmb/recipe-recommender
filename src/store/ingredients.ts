import { create } from "zustand"

export type IngredientsState = {
  ingredients: string[]
  setIngredients: (ingredients: string[]) => void
}

export const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [],
  setIngredients: (ingredients: string[]) => set({ ingredients }),
}))
