import { createElement } from "react"
import { vi } from "vitest"

export const mockLike = vi.fn()
export const mockDislike = vi.fn()

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
