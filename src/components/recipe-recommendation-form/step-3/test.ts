import "./mocks"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it, vi } from "vitest"
import type { Meal } from "@/schemas"
import Step3 from "./index"
import {
  mockDislike,
  mockLike,
  mockUseFormContext,
  mockUseRecommendedMeals,
  mockUseRecommendedMealsStore,
  mockUseStepsStore,
} from "./mocks"

const testMeal = {
  idMeal: "52772",
  strMeal: "Chicken Pasta",
  strCategory: "Chicken",
  strArea: "Italian",
  strMealThumb: "https://example.com/thumb.jpg",
  strSource: "https://example.com/recipe",
} as Meal

type SetupOptions = {
  recommendedMeals?: Meal[]
}

type SetupResult = ReturnType<typeof render> & {
  setRecommendedMeals: ReturnType<typeof vi.fn>
  setCurrentStep: ReturnType<typeof vi.fn>
  formReset: ReturnType<typeof vi.fn>
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseRecommendedMeals.mockReset()
  mockUseRecommendedMealsStore.mockReset()
  mockUseStepsStore.mockReset()
  mockUseFormContext.mockReset()
  mockLike.mockReset()
  mockDislike.mockReset()

  const recommendedMeals = options.recommendedMeals ?? []

  const setRecommendedMeals = vi.fn()
  const setCurrentStep = vi.fn()
  const formReset = vi.fn()

  mockUseRecommendedMeals.mockReturnValue(recommendedMeals)
  mockUseRecommendedMealsStore.mockReturnValue({ setRecommendedMeals })
  mockUseStepsStore.mockReturnValue({ setCurrentStep })
  mockUseFormContext.mockReturnValue({
    form: { reset: formReset },
  })

  const utils = render(createElement(Step3))

  return {
    ...utils,
    setRecommendedMeals,
    setCurrentStep,
    formReset,
  }
}

describe("Step3", () => {
  it("does not sync the store when there are no recommendations and shows the empty state with a New idea action", () => {
    const { setRecommendedMeals } = setup({ recommendedMeals: [] })

    expect(
      screen.queryByRole("heading", { name: "Recommended Meal" })
    ).not.toBeInTheDocument()
    expect(
      screen.getByText("No recommended meals found with your preferences")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Try again with different preferences")
    ).toBeInTheDocument()
    expect(setRecommendedMeals).not.toHaveBeenCalled()
    expect(
      screen.getByRole("button", { name: "New idea" })
    ).toBeInTheDocument()
  })

  it("syncs recommendations to the store and renders the meal card with image, link, and feedback actions", async () => {
    const { setRecommendedMeals } = setup({
      recommendedMeals: [testMeal],
    })

    await waitFor(() => {
      expect(setRecommendedMeals).toHaveBeenCalledWith([testMeal])
    })

    expect(
      screen.getByRole("heading", { name: "Recommended Meal" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: testMeal.strMeal })
    ).toHaveAttribute("src", testMeal.strMealThumb)
    expect(
      screen.getByRole("link", { name: testMeal.strMeal })
    ).toHaveAttribute("href", testMeal.strSource)

    const [likeButton, dislikeButton] = screen.getAllByRole("button")

    fireEvent.click(likeButton)
    expect(mockLike).toHaveBeenCalledWith(testMeal)

    fireEvent.click(dislikeButton)
    expect(mockDislike).toHaveBeenCalledWith(testMeal)
  })

  it("resets the flow when New idea is pressed", () => {
    const { setCurrentStep, formReset, setRecommendedMeals } = setup({
      recommendedMeals: [],
    })

    fireEvent.click(screen.getByRole("button", { name: "New idea" }))

    expect(setCurrentStep).toHaveBeenCalledWith(1)
    expect(formReset).toHaveBeenCalledWith({ area: "", mainIngredient: "" })
    expect(setRecommendedMeals).toHaveBeenCalledWith([])
  })
})
