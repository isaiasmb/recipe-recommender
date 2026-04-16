import "./mocks"
import { renderHook, type RenderHookResult } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Meal } from "@/schemas"
import {
  mockUseFormContext,
  mockUseHistoryStore,
  mockUseRecommendedMealsStore,
} from "./mocks"
import { useHistory } from "./index"

const meal = { idMeal: "52772" } as Meal

type UseHistoryValue = ReturnType<typeof useHistory>

type SetupOptions = {
  area?: string
  mainIngredient?: string
}

type SetupResult = {
  result: RenderHookResult<UseHistoryValue, undefined>["result"]
  likeMeal: ReturnType<typeof vi.fn>
  dislikeMeal: ReturnType<typeof vi.fn>
  removeRecommendedMeal: ReturnType<typeof vi.fn>
  getFieldValue: ReturnType<typeof vi.fn>
  preferences: { area: string; mainIngredient: string }
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseFormContext.mockReset()
  mockUseHistoryStore.mockReset()
  mockUseRecommendedMealsStore.mockReset()

  const area = options.area ?? "Italian"
  const mainIngredient = options.mainIngredient ?? "Chicken"
  const preferences = { area, mainIngredient }

  const likeMeal = vi.fn()
  const dislikeMeal = vi.fn()
  const removeRecommendedMeal = vi.fn()

  const getFieldValue = vi.fn((field: string) => {
    if (field === "area") return area
    if (field === "mainIngredient") return mainIngredient
    return undefined
  })

  mockUseFormContext.mockReturnValue({
    form: { getFieldValue },
  })
  mockUseHistoryStore.mockReturnValue({
    likeMeal,
    dislikeMeal,
  })
  mockUseRecommendedMealsStore.mockReturnValue({
    removeRecommendedMeal,
  })

  const { result } = renderHook(() => useHistory())

  return {
    result,
    likeMeal,
    dislikeMeal,
    removeRecommendedMeal,
    getFieldValue,
    preferences,
  }
}

describe("useHistory", () => {
  it.each([
    { name: "like", action: "like" as const },
    { name: "dislike", action: "dislike" as const },
  ])(
    "$name passes form preferences to history and removes the meal from recommendations",
    ({ action }) => {
      const {
        result,
        likeMeal,
        dislikeMeal,
        removeRecommendedMeal,
        getFieldValue,
        preferences,
      } = setup()

      const run =
        action === "like" ? result.current.like : result.current.dislike
      run(meal)

      expect(getFieldValue).toHaveBeenCalledWith("area")
      expect(getFieldValue).toHaveBeenCalledWith("mainIngredient")

      if (action === "like") {
        expect(likeMeal).toHaveBeenCalledWith(meal, preferences)
        expect(dislikeMeal).not.toHaveBeenCalled()
      } else {
        expect(dislikeMeal).toHaveBeenCalledWith(meal, preferences)
        expect(likeMeal).not.toHaveBeenCalled()
      }

      expect(removeRecommendedMeal).toHaveBeenCalledTimes(1)
      expect(removeRecommendedMeal).toHaveBeenCalledWith(meal)
    }
  )
})
