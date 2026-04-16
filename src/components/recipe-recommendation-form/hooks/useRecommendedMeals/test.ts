import "./mocks"
import { renderHook, type RenderHookResult } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Meal } from "@/schemas"
import type { HistoryItem } from "@/store/history"
import { useRecommendedMeals } from "./index"
import {
  mockUseFormContext,
  mockUseHistoryStore,
  mockUseMealsStore,
} from "./mocks"

const italianSlot1 = {
  idMeal: "1",
  strMeal: "Arancini",
  strArea: "Italian",
  strIngredient1: "chicken",
} as Meal

const italianSlot3 = {
  idMeal: "2",
  strMeal: "Ziti",
  strArea: "Italian",
  strIngredient3: "chicken",
} as Meal

const mexicanSlot1 = {
  idMeal: "3",
  strMeal: "Tacos",
  strArea: "Mexican",
  strIngredient1: "chicken",
} as Meal

const italianNoMatch = {
  idMeal: "4",
  strMeal: "Pasta",
  strArea: "Italian",
  strIngredient1: "tomato",
} as Meal

const historyItem = (idMeal: string): HistoryItem =>
  ({
    meal: { idMeal } as Meal,
    liked: true,
    preferences: { area: "Italian", mainIngredient: "Chicken" },
    createdAt: "2020-01-01T00:00:00.000Z",
  }) as HistoryItem

type SetupOptions = {
  area?: string | null
  mainIngredient?: string | null
  meals?: Meal[]
  allMeals?: HistoryItem[]
}

type SetupResult = {
  result: RenderHookResult<ReturnType<typeof useRecommendedMeals>, undefined>["result"]
  getFieldValue: ReturnType<typeof vi.fn>
  mockUseFormContext: typeof mockUseFormContext
  mockUseHistoryStore: typeof mockUseHistoryStore
  mockUseMealsStore: typeof mockUseMealsStore
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseFormContext.mockReset()
  mockUseHistoryStore.mockReset()
  mockUseMealsStore.mockReset()

  const area = "area" in options ? options.area : "Italian"
  const mainIngredient =
    "mainIngredient" in options ? options.mainIngredient : "Chicken"
  const meals = options.meals ?? []
  const allMeals = options.allMeals ?? []

  const getFieldValue = vi.fn((field: string) => {
    if (field === "area") return area
    if (field === "mainIngredient") return mainIngredient
    return undefined
  })

  mockUseFormContext.mockReturnValue({
    form: { getFieldValue },
  })

  mockUseHistoryStore.mockImplementation((selector) =>
    selector({ allMeals })
  )

  mockUseMealsStore.mockReturnValue({ meals, setMeals: vi.fn() })

  const { result } = renderHook(() => useRecommendedMeals())

  return {
    result,
    getFieldValue,
    mockUseFormContext,
    mockUseHistoryStore,
    mockUseMealsStore,
  }
}

describe("useRecommendedMeals", () => {
  it.each([
    {
      name: "area is undefined",
      options: { area: undefined, mainIngredient: "Chicken" } as SetupOptions,
    },
    {
      name: "area is empty string",
      options: { area: "", mainIngredient: "Chicken" } as SetupOptions,
    },
    {
      name: "main ingredient is undefined",
      options: { area: "Italian", mainIngredient: undefined } as SetupOptions,
    },
    {
      name: "main ingredient is empty",
      options: { area: "Italian", mainIngredient: "" } as SetupOptions,
    },
    {
      name: "main ingredient is whitespace only",
      options: { area: "Italian", mainIngredient: "   " } as SetupOptions,
    },
  ])("returns an empty list when $name", ({ options }) => {
    const { result } = setup({
      ...options,
      meals: [italianSlot1, mexicanSlot1],
    })

    expect(result.current).toEqual([])
  })

  it.each([
    {
      name: "no meals share the selected area",
      meals: [mexicanSlot1],
      area: "Italian",
      mainIngredient: "Chicken",
    },
    {
      name: "matching meals have no ingredient slot for the main ingredient",
      meals: [italianNoMatch],
      area: "Italian",
      mainIngredient: "Chicken",
    },
    {
      name: "every matching meal is already in history",
      meals: [italianSlot1],
      area: "Italian",
      mainIngredient: "Chicken",
      allMeals: [historyItem("1")],
    },
  ])(
    "returns an empty list when $name",
    ({ meals, area, mainIngredient, allMeals }) => {
      const { result } = setup({
        area,
        mainIngredient,
        meals,
        allMeals,
      })

      expect(result.current).toEqual([])
    }
  )

  it("excludes meals in history, keeps area and ingredient matches, and sorts by lowest ingredient slot then meal name", () => {
    const italianSlot2NameB = {
      idMeal: "10",
      strMeal: "Bruschetta",
      strArea: "Italian",
      strIngredient2: "chicken",
    } as Meal

    const italianSlot2NameA = {
      idMeal: "11",
      strMeal: "Antipasto",
      strArea: "Italian",
      strIngredient2: "chicken",
    } as Meal

    const { result } = setup({
      meals: [
        italianSlot3,
        italianSlot1,
        mexicanSlot1,
        italianSlot2NameB,
        italianSlot2NameA,
      ],
      allMeals: [historyItem("1")],
    })

    expect(result.current).toEqual([
      italianSlot2NameA,
      italianSlot2NameB,
      italianSlot3,
    ])
  })

  it("reads form fields and history through the expected hooks", () => {
    const { getFieldValue, mockUseHistoryStore, mockUseMealsStore } = setup({
      meals: [italianSlot1],
    })

    expect(getFieldValue).toHaveBeenCalledWith("area")
    expect(getFieldValue).toHaveBeenCalledWith("mainIngredient")
    expect(mockUseHistoryStore).toHaveBeenCalled()
    expect(mockUseMealsStore).toHaveBeenCalled()
  })
})
