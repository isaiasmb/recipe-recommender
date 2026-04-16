import { vi } from "vitest"

export const mockUseFormContext = vi.fn()
export const mockUseHistoryStore = vi.fn()
export const mockUseMealsStore = vi.fn()

vi.mock("../../formContext", () => ({
  useFormContext: mockUseFormContext,
}))

vi.mock("@/store/history", () => ({
  useHistoryStore: mockUseHistoryStore,
}))

vi.mock("@/store/meals", () => ({
  __esModule: true,
  default: mockUseMealsStore,
}))
