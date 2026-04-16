import { createElement } from "react"
import { vi } from "vitest"

const mocks = vi.hoisted(() => ({
  mockUseHistoryStore: vi.fn(),
  mockMealsEmptyList: vi.fn(
    (props: { title: string; description?: string }) =>
      createElement("section", {
        "aria-label": props.title,
        role: "region",
      })
  ),
}))

export const mockUseHistoryStore = mocks.mockUseHistoryStore
export const mockMealsEmptyList = mocks.mockMealsEmptyList

vi.mock("@/store/history", () => ({
  useHistoryStore: () => mockUseHistoryStore(),
}))

vi.mock("../meals-empty-list", () => ({
  default: function MealsEmptyList(props: {
    title: string
    description?: string
  }) {
    return mockMealsEmptyList(props)
  },
}))

vi.mock("@/components/image", () => ({
  default: (props: { src: string; alt: string }) =>
    createElement("img", {
      src: props.src,
      alt: props.alt,
    }),
}))
