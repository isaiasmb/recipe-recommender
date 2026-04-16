import { vi } from "vitest"

export const mockGetAreas = vi.fn()
export const mockGetMealsByArea = vi.fn()
export const mockGetMealById = vi.fn()

vi.mock("@/http/get-areas", () => ({
  getAreas: (...args: unknown[]) => mockGetAreas(...args),
}))

vi.mock("@/http/get-meals", () => ({
  getMealsByArea: (...args: unknown[]) => mockGetMealsByArea(...args),
}))

vi.mock("@/http/get-meal", () => ({
  getMealById: (...args: unknown[]) => mockGetMealById(...args),
}))
