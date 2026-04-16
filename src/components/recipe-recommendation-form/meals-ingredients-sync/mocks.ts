import { vi } from "vitest"

export const mockUseFormContext = vi.fn()
export const mockUseStore = vi.fn()
export const mockUseMealsIngredients = vi.fn()
export const mockUseIngredientsStore = vi.fn()
export const mockUseMealsStore = vi.fn()

vi.mock("../formContext", () => ({
  useFormContext: mockUseFormContext,
}))

vi.mock("@tanstack/react-form", () => ({
  useStore: mockUseStore,
}))

vi.mock("../hooks/useMealsIngredients", () => ({
  useMealsIngredients: mockUseMealsIngredients,
}))

vi.mock("@/store/ingredients", () => ({
  useIngredientsStore: mockUseIngredientsStore,
}))

vi.mock("@/store/meals", () => ({
  useMealsStore: mockUseMealsStore,
}))
