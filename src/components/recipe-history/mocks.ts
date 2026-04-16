import { createElement } from "react"
import { vi } from "vitest"

const mocks = vi.hoisted(() => ({
  mockLikedMeals: vi.fn(() =>
    createElement("section", { "aria-label": "Liked meals list" })
  ),
  mockDislikedMeals: vi.fn(() =>
    createElement("section", { "aria-label": "Disliked meals list" })
  ),
  mockAllMeals: vi.fn(() =>
    createElement("section", { "aria-label": "All meals list" })
  ),
}))

export const mockLikedMeals = mocks.mockLikedMeals
export const mockDislikedMeals = mocks.mockDislikedMeals
export const mockAllMeals = mocks.mockAllMeals

vi.mock("./liked-meals", () => ({
  default: function LikedMeals() {
    return mockLikedMeals()
  },
}))

vi.mock("./disliked-meals", () => ({
  default: function DislikedMeals() {
    return mockDislikedMeals()
  },
}))

vi.mock("./all-meals", () => ({
  default: function AllMeals() {
    return mockAllMeals()
  },
}))
