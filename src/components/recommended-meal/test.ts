import "./mocks"
import { fireEvent, render, screen } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import type { Meal } from "@/schemas"
import RecommendedMeal from "./index"
import { mockDislike, mockLike } from "./mocks"

const baseMeal = {
  idMeal: "52772",
  strMeal: "Chicken Pasta",
  strCategory: "Chicken",
  strArea: "Italian",
  strMealThumb: "https://example.com/thumb.jpg",
  strSource: "https://example.com/recipe",
} as Meal

const secondMeal = {
  ...baseMeal,
  idMeal: "99999",
  strMeal: "Beef Stew",
  strCategory: "Beef",
  strArea: "French",
  strMealThumb: "https://example.com/other.jpg",
  strSource: "https://example.com/other-recipe",
} as Meal

type SetupOptions = {
  recommendedMeals?: Meal[]
}

type SetupResult = ReturnType<typeof render> & {
  mockLike: typeof mockLike
  mockDislike: typeof mockDislike
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockLike.mockReset()
  mockDislike.mockReset()

  const recommendedMeals = options.recommendedMeals ?? [baseMeal]

  const utils = render(
    createElement(RecommendedMeal, { recommendedMeals })
  )

  return {
    ...utils,
    mockLike,
    mockDislike,
  }
}

describe("RecommendedMeal", () => {
  it("renders nothing when there are no recommended meals", () => {
    setup({ recommendedMeals: [] })

    expect(
      screen.queryByRole("heading", { name: "Recommended Meal" })
    ).not.toBeInTheDocument()
  })

  it("renders only the first meal, full details, and wires like and dislike to that meal", () => {
    const { mockLike, mockDislike } = setup({
      recommendedMeals: [baseMeal, secondMeal],
    })

    expect(
      screen.getByRole("heading", { name: "Recommended Meal" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("We found a meal that matches your preferences")
    ).toBeInTheDocument()

    expect(screen.queryByText(secondMeal.strMeal)).not.toBeInTheDocument()
    expect(screen.getByText(baseMeal.strCategory)).toBeInTheDocument()
    expect(screen.getByText(baseMeal.strArea)).toBeInTheDocument()
    expect(screen.getByText("Do you like it?")).toBeInTheDocument()

    expect(
      screen.getByRole("img", { name: baseMeal.strMeal })
    ).toHaveAttribute("src", baseMeal.strMealThumb)

    expect(screen.getByRole("link", { name: baseMeal.strMeal })).toHaveAttribute(
      "href",
      baseMeal.strSource
    )

    const [likeButton, dislikeButton] = screen.getAllByRole("button")
    fireEvent.click(likeButton)
    expect(mockLike).toHaveBeenCalledWith(baseMeal)

    fireEvent.click(dislikeButton)
    expect(mockDislike).toHaveBeenCalledWith(baseMeal)
  })
})
