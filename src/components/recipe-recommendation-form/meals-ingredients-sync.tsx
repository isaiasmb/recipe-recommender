import { useStore } from "@tanstack/react-form"
import { useEffect } from "react"
import { useIngredientsStore } from "@/store/ingredients"
import { useMealsStore } from "@/store/meals"
import { useMealsIngredients } from "./hooks/useMealsIngredients"
import { useFormContext } from "./formContext"

/**
 * Loads meals/ingredients for the selected area and mirrors them into global stores.
 * Lives outside step panels so deep links to step 3 still populate data that step 2 used to fetch.
 */
export const MealsIngredientsSync = () => {
  const { form } = useFormContext()
  const area = useStore(form.store, (s) => s.values.area)
  const { ingredients, meals } = useMealsIngredients(area)
  const { setIngredients } = useIngredientsStore()
  const { setMeals } = useMealsStore()

  useEffect(() => {
    if (ingredients.length) {
      setIngredients(ingredients)
    }
    if (meals.length) {
      setMeals(meals)
    }
  }, [ingredients, meals, setIngredients, setMeals])

  return null
}
