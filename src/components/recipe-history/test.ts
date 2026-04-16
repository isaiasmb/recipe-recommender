import "./mocks"
import { fireEvent, render, screen } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import RecipeHistory from "./index"
import { mockAllMeals, mockDislikedMeals, mockLikedMeals } from "./mocks"

type SetupResult = ReturnType<typeof render> & {
  mockLikedMeals: typeof mockLikedMeals
  mockDislikedMeals: typeof mockDislikedMeals
  mockAllMeals: typeof mockAllMeals
}

const setup = (): SetupResult => {
  mockLikedMeals.mockClear()
  mockDislikedMeals.mockClear()
  mockAllMeals.mockClear()

  const utils = render(createElement(RecipeHistory))

  return {
    ...utils,
    mockLikedMeals,
    mockDislikedMeals,
    mockAllMeals,
  }
}

describe("RecipeHistory", () => {
  it("renders the history title, description, and shows the liked list by default", () => {
    const { mockLikedMeals, mockDislikedMeals, mockAllMeals } = setup()

    expect(screen.getByText("History")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Your saved recommendations. Filter by liked/disliked, sorted newest first."
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole("region", { name: "Liked meals list" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("region", { name: "Disliked meals list" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("region", { name: "All meals list" })
    ).not.toBeInTheDocument()

    expect(mockLikedMeals).toHaveBeenCalledTimes(1)
    expect(mockDislikedMeals).not.toHaveBeenCalled()
    expect(mockAllMeals).not.toHaveBeenCalled()
  })

  it.each([
    {
      filterName: "Disliked",
      regionName: "Disliked meals list",
      otherRegions: ["Liked meals list", "All meals list"] as const,
      getExpectedMock: (r: SetupResult) => r.mockDislikedMeals,
    },
    {
      filterName: "All",
      regionName: "All meals list",
      otherRegions: ["Liked meals list", "Disliked meals list"] as const,
      getExpectedMock: (r: SetupResult) => r.mockAllMeals,
    },
  ])(
    "shows the $filterName list when that filter is selected",
    ({ filterName, regionName, otherRegions, getExpectedMock }) => {
      const result = setup()

      fireEvent.click(screen.getByRole("radio", { name: filterName }))

      expect(
        screen.getByRole("region", { name: regionName })
      ).toBeInTheDocument()
      for (const name of otherRegions) {
        expect(screen.queryByRole("region", { name })).not.toBeInTheDocument()
      }

      expect(getExpectedMock(result)).toHaveBeenCalled()
    }
  )

  it("returns to the liked list when Liked is selected after another filter", () => {
    setup()

    fireEvent.click(screen.getByRole("radio", { name: "All" }))
    expect(
      screen.getByRole("region", { name: "All meals list" })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("radio", { name: "Liked" }))
    expect(
      screen.getByRole("region", { name: "Liked meals list" })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("region", { name: "All meals list" })
    ).not.toBeInTheDocument()
  })
})
