import "./mocks"
import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import type { Meal } from "@/schemas"
import {
  mockGetMealById,
  mockGetMealsByArea,
  mockUseQueries,
  mockUseQuery,
} from "./mocks"
import { useMealsIngredients } from "./index"

type ListQuery = {
  data?: { meals: { idMeal: string }[] }
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: unknown
}

type DetailQuery = {
  data?: { meals: Meal[] }
  isPending: boolean
  isError: boolean
  error?: unknown
  dataUpdatedAt: number
}

const list = (overrides: Partial<ListQuery> = {}): ListQuery => ({
  data: undefined,
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
  ...overrides,
})

const detail = (overrides: Partial<DetailQuery> = {}): DetailQuery => ({
  data: undefined,
  isPending: false,
  isError: false,
  dataUpdatedAt: 0,
  ...overrides,
})

describe("useMealsIngredients", () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockUseQueries.mockReset()
    mockGetMealsByArea.mockReset()
    mockGetMealById.mockReset()
  })

  it.each([
    {
      name: "empty area",
      area: "",
      listQuery: list({ isPending: false }),
      detailQueries: [] as DetailQuery[],
    },
    {
      name: "area with no meals in list response",
      area: "Italian",
      listQuery: list({
        data: { meals: [] },
        isSuccess: true,
      }),
      detailQueries: [],
    },
  ])(
    "is idle with empty meals and ingredients when $name",
    ({ area, listQuery, detailQueries }) => {
      mockUseQuery.mockReturnValue(listQuery)
      mockUseQueries.mockReturnValue(detailQueries)

      const { result } = renderHook(() => useMealsIngredients(area))

      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.meals).toEqual([])
      expect(result.current.ingredients).toEqual([])
    }
  )

  it("loads while the area meal list is pending", () => {
    mockUseQuery.mockReturnValue(
      list({ isPending: true, isSuccess: false, data: undefined })
    )
    mockUseQueries.mockReturnValue([])

    const { result } = renderHook(() => useMealsIngredients("Mexican"))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.meals).toEqual([])
    expect(result.current.ingredients).toEqual([])
  })

  it("loads while meal ids exist but detail queries are still pending", () => {
    mockUseQuery.mockReturnValue(
      list({
        data: { meals: [{ idMeal: "1" }, { idMeal: "2" }] },
        isPending: false,
        isSuccess: true,
      })
    )
    mockUseQueries.mockReturnValue([
      detail({ isPending: true, dataUpdatedAt: 0 }),
      detail({ isPending: true, dataUpdatedAt: 0 }),
    ])

    const { result } = renderHook(() => useMealsIngredients("Thai"))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.meals).toEqual([])
    expect(result.current.ingredients).toEqual([])
  })

  it("returns merged sorted ingredients and meals once all details have settled", () => {
    const mealA = {
      idMeal: "1",
      strIngredient1: "lime",
      strIngredient2: "  ",
    } as Meal
    const mealB = {
      idMeal: "2",
      strIngredient1: "coconut",
      strIngredient2: "lime",
    } as Meal

    mockUseQuery.mockReturnValue(
      list({
        data: { meals: [{ idMeal: "1" }, { idMeal: "2" }] },
        isPending: false,
        isSuccess: true,
      })
    )
    mockUseQueries.mockReturnValue([
      detail({
        data: { meals: [mealA] },
        dataUpdatedAt: 10,
      }),
      detail({
        data: { meals: [mealB] },
        dataUpdatedAt: 20,
      }),
    ])

    const { result } = renderHook(() => useMealsIngredients("Thai"))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.meals).toEqual([mealA, mealB])
    expect(result.current.ingredients).toEqual(["Coconut", "Lime"])
  })

  it("skips missing detail rows and still aggregates ingredients from the rest", () => {
    const meal = {
      idMeal: "1",
      strIngredient1: "salt",
    } as Meal

    mockUseQuery.mockReturnValue(
      list({
        data: { meals: [{ idMeal: "1" }, { idMeal: "2" }] },
        isPending: false,
        isSuccess: true,
      })
    )
    mockUseQueries.mockReturnValue([
      detail({
        data: { meals: [meal] },
        dataUpdatedAt: 1,
      }),
      detail({
        data: { meals: [] },
        dataUpdatedAt: 2,
      }),
    ])

    const { result } = renderHook(() => useMealsIngredients("Greek"))

    expect(result.current.meals).toEqual([meal])
    expect(result.current.ingredients).toEqual(["Salt"])
  })

  it.each([
    {
      name: "list query",
      listQuery: list({
        isPending: false,
        isSuccess: false,
        isError: true,
        error: new Error("list failed"),
      }),
      detailQueries: [] as DetailQuery[],
      expectedError: new Error("list failed"),
    },
    {
      name: "detail query",
      listQuery: list({
        data: { meals: [{ idMeal: "9" }] },
        isPending: false,
        isSuccess: true,
      }),
      detailQueries: [
        detail({
          isError: true,
          error: new Error("detail failed"),
          dataUpdatedAt: 1,
        }),
      ],
      expectedError: new Error("detail failed"),
    },
  ])("surfaces error from $name", ({ listQuery, detailQueries, expectedError }) => {
    mockUseQuery.mockReturnValue(listQuery)
    mockUseQueries.mockReturnValue(detailQueries)

    const { result } = renderHook(() => useMealsIngredients("French"))

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toEqual(expectedError)
  })

  it("prefers the list query error over a detail error", () => {
    const listErr = new Error("list")
    const detailErr = new Error("detail")

    mockUseQuery.mockReturnValue(
      list({
        isError: true,
        error: listErr,
        isPending: false,
        isSuccess: false,
      })
    )
    mockUseQueries.mockReturnValue([
      detail({ isError: true, error: detailErr, dataUpdatedAt: 1 }),
    ])

    const { result } = renderHook(() => useMealsIngredients("Spanish"))

    expect(result.current.error).toBe(listErr)
  })

  it("keeps meals and ingredients empty when detail query count does not match ids (settled but not aligned)", () => {
    mockUseQuery.mockReturnValue(
      list({
        data: { meals: [{ idMeal: "1" }] },
        isPending: false,
        isSuccess: true,
      })
    )
    mockUseQueries.mockReturnValue([
      detail({ dataUpdatedAt: 1 }),
      detail({ dataUpdatedAt: 2 }),
    ])

    const { result } = renderHook(() => useMealsIngredients("Japanese"))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.meals).toEqual([])
    expect(result.current.ingredients).toEqual([])
  })
})
