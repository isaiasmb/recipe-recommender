import { createElement } from "react"
import { vi } from "vitest"

export const mockUseMealsIngredients = vi.fn()
export const mockUseFormContext = vi.fn()
export const mockToastError = vi.fn()

vi.mock("../hooks/useMealsIngredients", () => ({
  useMealsIngredients: (area: string) => mockUseMealsIngredients(area),
}))

vi.mock("@/components/bg-image", () => ({
  default: (props: { imagePath: string }) =>
    createElement("div", {
      role: "img",
      "aria-label": `Decorative background ${props.imagePath}`,
    }),
}))

vi.mock("sonner", async (importOriginal) => {
  const actual = await importOriginal<typeof import("sonner")>()
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: mockToastError,
    },
  }
})

vi.mock("../formContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../formContext")>()
  return {
    ...actual,
    useFormContext: () => mockUseFormContext(),
  }
})
