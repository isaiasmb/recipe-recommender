import { useQueries, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { getMealById } from "@/http/get-meal"
import { type Meal } from "@/schemas"
import { getMealsByArea } from "@/http/get-meals"
import { toTitleCase } from "@/utils/string"

/** Stable empty lists so loading / partial-fetch states do not churn referential identity. */
const EMPTY_INGREDIENTS: string[] = []
const EMPTY_MEALS: Meal[] = []
const INGREDIENTS_LIMIT = 5

/** Collects ingredients from a recipe. */
const collectIngredientsFromRecipe = (recipe: Record<string, unknown>) => {
  const ingredients = new Set<string>()
  for (let i = 1; i <= INGREDIENTS_LIMIT; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    if (typeof ingredient !== "string" || !ingredient.trim()) {
      break
    }

    ingredients.add(toTitleCase(ingredient))
  }
  return ingredients
}

export type UseMealsIngredientsResult = {
  ingredients: string[]
  /** Full meal rows from lookup-by-id queries, in list order, once all detail fetches have settled. */
  meals: Meal[]
  isLoading: boolean
  isError: boolean
  error: unknown
}

/** Collects ingredients (and full meal details) from meals for the given area. */
export const useMealsIngredients = (
  area: string
): UseMealsIngredientsResult => {
  const mealsQuery = useQuery({
    queryKey: ["meals", area],
    queryFn: () => getMealsByArea(area!),
    enabled: Boolean(area),
    staleTime: Infinity,
  })

  const mealIds = useMemo(
    () => (mealsQuery.data?.meals ?? []).map((meal) => meal.idMeal),
    [mealsQuery.data?.meals]
  )

  const mealQueries = useQueries({
    queries: mealIds.map((id) => ({
      queryKey: ["meal", id],
      queryFn: () => getMealById(id),
      enabled: Boolean(area) && mealsQuery.isSuccess && mealIds.length > 0,
      staleTime: Infinity,
    })),
  })

  /** Only true once the area list is resolved and every meal-detail query has finished (no partial merges). */
  const listPhaseDone = !area || !mealsQuery.isPending
  const detailsSettled =
    listPhaseDone &&
    (mealIds.length === 0 ||
      (mealQueries.length === mealIds.length &&
        mealQueries.every((q) => !q.isPending)))

  /** Bumps when any meal detail payload updates; used only after `detailsSettled`. */
  const mealDetailVersions = mealQueries.map((q) => q.dataUpdatedAt).join(",")

  const meals = useMemo(() => {
    if (!detailsSettled) {
      return EMPTY_MEALS
    }
    const list: Meal[] = []
    for (const q of mealQueries) {
      const meal = q.data?.meals?.[0]
      if (meal) {
        list.push(meal)
      }
    }
    return list
  }, [detailsSettled, mealDetailVersions, mealIds])

  const ingredients = useMemo(() => {
    if (!detailsSettled) {
      return EMPTY_INGREDIENTS
    }
    if (!mealQueries.length) {
      return EMPTY_INGREDIENTS
    }
    const merged = new Set<string>()
    for (const q of mealQueries) {
      const recipe = q.data?.meals?.[0] as Record<string, unknown> | undefined
      if (!recipe) {
        continue
      }
      for (const ing of collectIngredientsFromRecipe(recipe)) {
        merged.add(ing)
      }
    }
    return Array.from(merged).sort((a, b) => a.localeCompare(b))
  }, [detailsSettled, mealDetailVersions, mealIds])

  const detailError = mealQueries.find((q) => q.isError)?.error
  const error = mealsQuery.error ?? detailError ?? null

  const isLoading =
    Boolean(area) &&
    (mealsQuery.isPending ||
      (mealIds.length > 0 && mealQueries.some((q) => q.isPending)))

  const isError = mealsQuery.isError || mealQueries.some((q) => q.isError)

  return {
    ingredients,
    meals,
    isLoading,
    isError,
    error,
  }
}
