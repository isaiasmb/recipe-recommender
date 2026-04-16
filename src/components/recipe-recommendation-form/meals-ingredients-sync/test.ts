import "./mocks"
import { render } from "@testing-library/react"
import { createElement, type ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"
import type { Meal } from "@/schemas"
import { MealsIngredientsSync } from "./index"
import {
  mockUseFormContext,
  mockUseIngredientsStore,
  mockUseMealsIngredients,
  mockUseMealsStore,
  mockUseStore,
} from "./mocks"

const mealA = { idMeal: "52772" } as Meal
const mealB = { idMeal: "52773" } as Meal

type SetupOptions = {
  area?: string
  ingredients?: string[]
  meals?: Meal[]
}

type SetupResult = {
  setIngredients: ReturnType<typeof vi.fn>
  setMeals: ReturnType<typeof vi.fn>
  rerender: (ui: ReactElement) => void
  mealsIngredientsData: { ingredients: string[]; meals: Meal[] }
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseFormContext.mockReset()
  mockUseStore.mockReset()
  mockUseMealsIngredients.mockReset()
  mockUseIngredientsStore.mockReset()
  mockUseMealsStore.mockReset()

  const area = options.area ?? "Italian"
  const mealsIngredientsData = {
    ingredients: options.ingredients ?? ["Tomato"],
    meals: options.meals ?? [mealA],
  }

  mockUseFormContext.mockReturnValue({
    form: { store: {} },
  })
  mockUseStore.mockImplementation(
    (
      _store: unknown,
      selector: (s: { values: { area: string } }) => string,
    ) => selector({ values: { area } }),
  )
  mockUseMealsIngredients.mockImplementation(() => mealsIngredientsData)

  const setIngredients = vi.fn()
  const setMeals = vi.fn()
  mockUseIngredientsStore.mockReturnValue({ setIngredients })
  mockUseMealsStore.mockReturnValue({ setMeals })

  const { rerender } = render(createElement(MealsIngredientsSync))

  return {
    setIngredients,
    setMeals,
    rerender,
    mealsIngredientsData,
  }
}

describe("MealsIngredientsSync", () => {
  it("writes non-empty ingredients and meals from useMealsIngredients into the global stores", () => {
    const ingredients = ["Tomato", "Basil"]
    const meals = [mealA, mealB]
    const { setIngredients, setMeals } = setup({ ingredients, meals })

    expect(setIngredients).toHaveBeenCalledTimes(1)
    expect(setIngredients).toHaveBeenCalledWith(ingredients)
    expect(setMeals).toHaveBeenCalledTimes(1)
    expect(setMeals).toHaveBeenCalledWith(meals)
  })

  it.each([
    {
      name: "empty ingredients only",
      ingredients: [] as string[],
      meals: [mealA],
      expectSetIngredients: false,
      expectSetMeals: true,
    },
    {
      name: "empty meals only",
      ingredients: ["Tomato"],
      meals: [] as Meal[],
      expectSetIngredients: true,
      expectSetMeals: false,
    },
    {
      name: "both empty",
      ingredients: [] as string[],
      meals: [] as Meal[],
      expectSetIngredients: false,
      expectSetMeals: false,
    },
  ])(
    "when $name, only calls setters for non-empty lists",
    ({ ingredients, meals, expectSetIngredients, expectSetMeals }) => {
      const { setIngredients, setMeals } = setup({ ingredients, meals })

      if (expectSetIngredients) {
        expect(setIngredients).toHaveBeenCalledWith(ingredients)
      } else {
        expect(setIngredients).not.toHaveBeenCalled()
      }
      if (expectSetMeals) {
        expect(setMeals).toHaveBeenCalledWith(meals)
      } else {
        expect(setMeals).not.toHaveBeenCalled()
      }
    },
  )

  it("re-runs the effect when ingredients or meals change and updates the stores", () => {
    const { setIngredients, setMeals, rerender, mealsIngredientsData } = setup({
      ingredients: ["Tomato"],
      meals: [mealA],
    })

    expect(setIngredients).toHaveBeenCalledTimes(1)
    expect(setMeals).toHaveBeenCalledTimes(1)
    setIngredients.mockClear()
    setMeals.mockClear()

    mealsIngredientsData.ingredients = ["Pasta", "Cheese"]
    mealsIngredientsData.meals = [mealB]
    rerender(createElement(MealsIngredientsSync))

    expect(setIngredients).toHaveBeenCalledTimes(1)
    expect(setIngredients).toHaveBeenCalledWith(["Pasta", "Cheese"])
    expect(setMeals).toHaveBeenCalledTimes(1)
    expect(setMeals).toHaveBeenCalledWith([mealB])
  })
})
