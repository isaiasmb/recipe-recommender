import { vi } from "vitest"

export const mockUseQuery = vi.fn()
export const mockUseQueries = vi.fn()
export const mockGetMealsByArea = vi.fn()
export const mockGetMealById = vi.fn()

vi.mock("@tanstack/react-query", () => ({
  useQuery: mockUseQuery,
  useQueries: mockUseQueries,
}))

vi.mock("@/http/get-meals", () => ({
  getMealsByArea: mockGetMealsByArea,
}))

vi.mock("@/http/get-meal", () => ({
  getMealById: mockGetMealById,
}))
