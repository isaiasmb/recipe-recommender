import { vi } from "vitest"

export const mockUseFormContext = vi.fn()
export const mockUseHistoryStore = vi.fn()
export const mockUseRecommendedMealsStore = vi.fn()

vi.mock("../../formContext", () => ({
  useFormContext: mockUseFormContext,
}))

vi.mock("@/store/history", () => ({
  useHistoryStore: mockUseHistoryStore,
}))

vi.mock("@/store/recommended-meals", () => ({
  __esModule: true,
  default: mockUseRecommendedMealsStore,
}))
