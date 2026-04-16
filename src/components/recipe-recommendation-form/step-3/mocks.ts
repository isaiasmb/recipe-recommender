import { createElement } from "react"
import { vi } from "vitest"

export const mockUseRecommendedMeals = vi.fn()
export const mockUseRecommendedMealsStore = vi.fn()
export const mockUseStepsStore = vi.fn()
export const mockUseFormContext = vi.fn()

export const mockLike = vi.fn()
export const mockDislike = vi.fn()

vi.mock("../hooks/useRecommendedMeals", () => ({
  useRecommendedMeals: () => mockUseRecommendedMeals(),
}))

vi.mock("@/store/recommended-meals", () => ({
  __esModule: true,
  default: () => mockUseRecommendedMealsStore(),
}))

vi.mock("@/store/steps", () => ({
  useStepsStore: () => mockUseStepsStore(),
}))

vi.mock("../formContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../formContext")>()
  return {
    ...actual,
    useFormContext: () => mockUseFormContext(),
  }
})

vi.mock("@/components/recipe-recommendation-form/hooks/useHistory", () => ({
  useHistory: () => ({
    like: mockLike,
    dislike: mockDislike,
  }),
}))

vi.mock("@/components/image", () => ({
  default: (props: { src: string; alt: string }) =>
    createElement("img", {
      src: props.src,
      alt: props.alt,
    }),
}))
