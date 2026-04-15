import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import Image from "./index"

describe("Image", () => {
  it("renders with src, alt, and loading attributes", () => {
    render(
      <Image src="https://example.com/food.jpg" alt="A delicious meal" />
    )
    const img = screen.getByRole("img", { name: "A delicious meal" })
    expect(img).toHaveAttribute("src", "https://example.com/food.jpg")
    expect(img).toHaveAttribute("alt", "A delicious meal")
    expect(img).toHaveAttribute("decoding", "async")
    expect(img).toHaveAttribute("loading", "eager")
  })

  it("merges className onto the container", () => {
    const { container } = render(
      <Image
        src="/photo.jpg"
        alt="Photo"
        className="custom-class max-w-sm"
      />
    )
    expect(container.firstChild).toHaveClass("custom-class", "max-w-sm")
  })

  it("fades the image in after load", async () => {
    render(<Image src="https://example.com/p.jpg" alt="Photo" />)
    const img = screen.getByRole("img", { name: "Photo" })

    fireEvent.load(img)

    await waitFor(() => {
      expect(img).toHaveClass("opacity-100")
    })
  })

  it("treats load error as ready and fades the image in", async () => {
    render(<Image src="https://example.com/broken.jpg" alt="Broken" />)
    const img = screen.getByRole("img", { name: "Broken" })

    fireEvent.error(img)

    await waitFor(() => {
      expect(img).toHaveClass("opacity-100")
    })
  })

  it("resets loading state when src changes", async () => {
    const { rerender } = render(
      <Image src="https://example.com/a.jpg" alt="Same" />
    )
    const img = screen.getByRole("img", { name: "Same" })
    fireEvent.load(img)
    await waitFor(() => expect(img).toHaveClass("opacity-100"))

    rerender(<Image src="https://example.com/b.jpg" alt="Same" />)
    const next = screen.getByRole("img", { name: "Same" })
    expect(next).toHaveAttribute("src", "https://example.com/b.jpg")
    expect(next).toHaveClass("opacity-0")
  })
})
