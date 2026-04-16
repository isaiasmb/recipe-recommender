import "./mocks"
import { render, screen } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import type { HistoryItem } from "@/store/history"
import type { Meal } from "@/schemas"
import DislikedMeals from "./index"
import { mockMealsEmptyList, mockUseHistoryStore } from "./mocks"

const baseMeal = {
  idMeal: "52772",
  strMeal: "Chicken Pasta",
  strCategory: "Chicken",
  strArea: "Italian",
  strMealThumb: "https://example.com/thumb.jpg",
  strSource: "https://example.com/recipe",
} as Meal

const dislikedHistoryItem = (meal: Meal): HistoryItem => ({
  meal,
  liked: false,
  preferences: { area: meal.strArea, mainIngredient: "pasta" },
  createdAt: "2024-01-01T00:00:00.000Z",
})

type SetupOptions = {
  dislikedMeals?: HistoryItem[]
}

type SetupResult = ReturnType<typeof render> & {
  mockMealsEmptyList: typeof mockMealsEmptyList
  mockUseHistoryStore: typeof mockUseHistoryStore
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockMealsEmptyList.mockClear()
  mockUseHistoryStore.mockReset()

  const dislikedMeals = options.dislikedMeals ?? []

  mockUseHistoryStore.mockReturnValue({ dislikedMeals })

  const utils = render(createElement(DislikedMeals))

  return {
    ...utils,
    mockMealsEmptyList,
    mockUseHistoryStore,
  }
}

describe("DislikedMeals", () => {
  it("shows the empty state with the expected copy when there are no disliked meals", () => {
    const { mockMealsEmptyList } = setup({ dislikedMeals: [] })

    expect(
      screen.getByRole("region", { name: "No Disliked Recipes Yet" })
    ).toBeInTheDocument()

    expect(mockMealsEmptyList).toHaveBeenCalledWith({
      title: "No Disliked Recipes Yet",
      description:
        "No disliked recipes yet. Try your first recipe to build your history!",
    })
  })

  it("renders meal links for disliked meals and does not show the empty state", () => {
    const mealA = baseMeal
    const mealB = { ...baseMeal, idMeal: "99999", strMeal: "Beef Stew" } as Meal

    const { mockMealsEmptyList } = setup({
      dislikedMeals: [
        dislikedHistoryItem(mealA),
        dislikedHistoryItem(mealB),
      ],
    })

    expect(
      screen.queryByRole("region", { name: "No Disliked Recipes Yet" })
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
