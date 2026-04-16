import "./mocks"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createElement, type ReactNode } from "react"
import { describe, expect, it } from "vitest"
import type { Meal } from "@/schemas"
import { useHistoryStore } from "@/store/history"
import { useIngredientsStore } from "@/store/ingredients"
import useMealsStore from "@/store/meals"
import { useRecommendedMealsStore } from "@/store/recommended-meals"
import { useStepsStore } from "@/store/steps"
import { FormContextProvider } from "./formContext"
import RecipeRecommendationForm from "./index"
import {
  mockGetAreas,
  mockGetMealById,
  mockGetMealsByArea,
} from "./mocks"

const ITALIAN_AREA = "Italian"
const MEAL_ID = "52772"

const empty = ""

/** Minimal valid `Meal` for API-shaped detail payloads used in the flow. */
const createMealDetail = (overrides: Partial<Meal> = {}): Meal =>
  ({
    idMeal: MEAL_ID,
    strMeal: "Chicken Pasta",
    strMealAlternate: null,
    strCategory: "Chicken",
    strArea: ITALIAN_AREA,
    strInstructions: "Cook.",
    strMealThumb: "https://example.com/thumb.jpg",
    strTags: null,
    strYoutube: null,
    strIngredient1: "chicken",
    strIngredient2: empty,
    strIngredient3: empty,
    strIngredient4: empty,
    strIngredient5: empty,
    strIngredient6: empty,
    strIngredient7: empty,
    strIngredient8: empty,
    strIngredient9: empty,
    strIngredient10: empty,
    strIngredient11: empty,
    strIngredient12: empty,
    strIngredient13: empty,
    strIngredient16: empty,
    strIngredient17: empty,
    strIngredient18: empty,
    strIngredient19: empty,
    strIngredient20: empty,
    strMeasure1: empty,
    strMeasure2: empty,
    strMeasure3: empty,
    strMeasure4: empty,
    strMeasure5: empty,
    strMeasure6: empty,
    strMeasure7: empty,
    strMeasure8: empty,
    strMeasure9: empty,
    strMeasure14: empty,
    strMeasure15: empty,
    strMeasure16: empty,
    strMeasure17: empty,
    strMeasure18: empty,
    strMeasure19: empty,
    strMeasure20: empty,
    strSource: "https://example.com/recipe",
    strImageSource: null,
    strCreativeCommonsConfirmed: null,
    dateModified: "2020-01-01",
    ...overrides,
  }) as Meal

type SetupOptions = {
  /** Response for `getAreas` (cuisine list). */
  areasResponse?: { meals: { strArea: string }[] }
  /** Response for `getMealsByArea` after an area is chosen. */
  mealsByAreaResponse?: {
    meals: { idMeal: string; strMeal: string; strMealThumb: string }[]
  }
  /** Full meal row returned by `getMealById` for each list id. */
  mealDetail?: Meal
}

type SetupResult = ReturnType<typeof render> & {
  user: ReturnType<typeof userEvent.setup>
  queryClient: QueryClient
  mealDetail: Meal
  mockGetAreas: typeof mockGetAreas
  mockGetMealsByArea: typeof mockGetMealsByArea
  mockGetMealById: typeof mockGetMealById
}

const resetClientStores = () => {
  useStepsStore.setState({ currentStep: 1 })
  useMealsStore.setState({ meals: [] })
  useRecommendedMealsStore.setState({ recommendedMeals: [] })
  useIngredientsStore.setState({ ingredients: [] })

  /** Avoid rehydrated history (localStorage) excluding the test meal from recommendations. */
  useHistoryStore.persist.clearStorage()
  useHistoryStore.setState({
    allMeals: [],
    likedMeals: [],
    dislikedMeals: [],
  })
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockGetAreas.mockReset()
  mockGetMealsByArea.mockReset()
  mockGetMealById.mockReset()

  resetClientStores()

  const mealDetail = options.mealDetail ?? createMealDetail()
  const areasResponse = options.areasResponse ?? {
    meals: [{ strArea: ITALIAN_AREA }],
  }
  const mealsByAreaResponse = options.mealsByAreaResponse ?? {
    meals: [
      {
        idMeal: MEAL_ID,
        strMeal: mealDetail.strMeal,
        strMealThumb: mealDetail.strMealThumb,
      },
    ],
  }

  mockGetAreas.mockResolvedValue(areasResponse)
  mockGetMealsByArea.mockImplementation((area: string) => {
    if (area === ITALIAN_AREA) {
      return Promise.resolve(mealsByAreaResponse)
    }
    return Promise.resolve({ meals: [] })
  })
  mockGetMealById.mockImplementation((id: string) =>
    Promise.resolve({
      meals: [id === mealDetail.idMeal ? mealDetail : createMealDetail({ idMeal: id })],
    })
  )

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const user = userEvent.setup()

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(FormContextProvider, null, children)
    )

  const utils = render(createElement(RecipeRecommendationForm), { wrapper })

  return {
    ...utils,
    user,
    queryClient,
    mealDetail,
    mockGetAreas,
    mockGetMealsByArea,
    mockGetMealById,
  }
}

describe("RecipeRecommendationForm integration", () => {
  it("runs steps 1–3: area and ingredient selection, HTTP-backed data, and store updates for recommendations", async () => {
    const { user, mealDetail } = setup()

    const areaCombo = await screen.findByRole("combobox", {
      name: "Cusine/Area",
    })
    await user.click(areaCombo)

    const italianOption = await screen.findByRole("option", {
      name: ITALIAN_AREA,
    })
    await user.click(italianOption)

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      })
    )

    const ingredientCombo = await screen.findByRole("combobox", {
      name: "Main ingredient",
    })
    await user.click(ingredientCombo)

    const chickenOption = await screen.findByRole("option", { name: "Chicken" })
    await user.click(chickenOption)

    await user.click(screen.getByRole("button", { name: "Next" }))

    expect(
      await screen.findByRole("heading", { name: "Recommended Meal" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("img", { name: mealDetail.strMeal })
    ).toHaveAttribute("src", mealDetail.strMealThumb)
    expect(screen.getByRole("link", { name: mealDetail.strMeal })).toHaveAttribute(
      "href",
      mealDetail.strSource
    )

    await waitFor(() => {
      const stored = useRecommendedMealsStore.getState().recommendedMeals
      expect(stored).toHaveLength(1)
      expect(stored[0]).toMatchObject({
        idMeal: mealDetail.idMeal,
        strMeal: mealDetail.strMeal,
        strArea: mealDetail.strArea,
      })
    })

    expect(useMealsStore.getState().meals.map((m) => m.idMeal)).toEqual([
      mealDetail.idMeal,
    ])
    expect(useIngredientsStore.getState().ingredients).toContain("Chicken")

    expect(mockGetAreas).toHaveBeenCalled()
    expect(mockGetMealsByArea).toHaveBeenCalledWith(ITALIAN_AREA)
    expect(mockGetMealById).toHaveBeenCalledWith(MEAL_ID)
  })
})
