import "./mocks"
import { render, screen } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import type { HistoryItem } from "@/store/history"
import type { Meal } from "@/schemas"
import AllMeals from "./index"
import { mockMealsEmptyList, mockUseHistoryStore } from "./mocks"

const baseMeal = {
  idMeal: "52772",
  strMeal: "Chicken Pasta",
  strCategory: "Chicken",
  strArea: "Italian",
  strMealThumb: "https://example.com/thumb.jpg",
  strSource: "https://example.com/recipe",
} as Meal

const historyItem = (meal: Meal, liked: boolean): HistoryItem => ({
  meal,
  liked,
  preferences: { area: meal.strArea, mainIngredient: "pasta" },
  createdAt: "2024-01-01T00:00:00.000Z",
})

type SetupOptions = {
  allMeals?: HistoryItem[]
}

type SetupResult = ReturnType<typeof render> & {
  mockMealsEmptyList: typeof mockMealsEmptyList
  mockUseHistoryStore: typeof mockUseHistoryStore
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockMealsEmptyList.mockClear()
  mockUseHistoryStore.mockReset()

  const allMeals = options.allMeals ?? []

  mockUseHistoryStore.mockReturnValue({ allMeals })

  const utils = render(createElement(AllMeals))

  return {
    ...utils,
    mockMealsEmptyList,
    mockUseHistoryStore,
  }
}

describe("AllMeals", () => {
  it("shows the empty state with the expected copy when there are no meals", () => {
    const { mockMealsEmptyList } = setup({ allMeals: [] })

    expect(
      screen.getByRole("region", { name: "No Recipes Yet" })
    ).toBeInTheDocument()

    expect(mockMealsEmptyList).toHaveBeenCalledWith({
      title: "No Recipes Yet",
      description:
        "No recommendations yet. Try your first recipe to build your history!",
    })
  })

  it("renders meal links for all meals and does not show the empty state", () => {
    const mealA = baseMeal
    const mealB = { ...baseMeal, idMeal: "99999", strMeal: "Beef Stew" } as Meal

    const { mockMealsEmptyList } = setup({
      allMeals: [historyItem(mealA, true), historyItem(mealB, false)],
    })

    expect(
      screen.queryByRole("region", { name: "No Recipes Yet" })
    ).not.toBeInTheDocument()
    expect(mockMealsEmptyList).not.toHaveBeenCalled()

    expect(
      screen.getByRole("link", { name: mealA.strMeal })
    ).toHaveAttribute("href", mealA.strSource)
    expect(
      screen.getByRole("link", { name: mealB.strMeal })
    ).toHaveAttribute("href", mealB.strSource)
  })
})
