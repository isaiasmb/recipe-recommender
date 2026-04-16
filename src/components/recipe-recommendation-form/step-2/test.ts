import "./mocks"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import {
  createElement,
  Fragment,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { describe, expect, it, vi } from "vitest"
import type { z } from "zod"
import Step2 from "./index"
import {
  mockToastError,
  mockUseFormContext,
  mockUseMealsIngredients,
} from "./mocks"

const mainIngredientLabel = /Main ingredient/i

const defaultIngredients = ["Chicken", "Tomato"]

type MockFieldProps = {
  name: string
  validators?: {
    onChange: z.ZodType<string>
  }
  children: (field: {
    name: string
    state: {
      value: string
      meta: {
        isTouched: boolean
        isValid: boolean
        errors: { message?: string }[]
      }
    }
    handleChange: (v: string) => void
    handleBlur: () => void
  }) => ReactNode
}

function createMockForm(options: { area: string; initialMainIngredient?: string }) {
  const { area, initialMainIngredient = "" } = options

  function Field({ name, validators, children }: MockFieldProps) {
    const [value, setValue] = useState(initialMainIngredient)
    const [isTouched, setIsTouched] = useState(false)

    const meta = useMemo(() => {
      const schema = validators?.onChange
      if (!schema) {
        return {
          isValid: true,
          errors: [] as { message?: string }[],
        }
      }
      const result = schema.safeParse(value)
      if (result.success) {
        return { isValid: true, errors: [] as { message?: string }[] }
      }
      return {
        isValid: false,
        errors: result.error.issues.map((issue) => ({ message: issue.message })),
      }
    }, [value, validators])

    const fieldApi = {
      name,
      state: {
        value,
        meta: { ...meta, isTouched },
      },
      handleChange: (v: string) => {
        setValue(v ?? "")
      },
      handleBlur: () => {
        setIsTouched(true)
      },
    }

    return createElement(Fragment, null, children(fieldApi))
  }

  return {
    Field,
    getFieldValue: (fieldName: string) => (fieldName === "area" ? area : ""),
  }
}

type MealsIngredientsState = {
  ingredients: string[]
  isLoading: boolean
  isError: boolean
  error: unknown
}

type SetupOptions = {
  area?: string
  initialMainIngredient?: string
  mealsIngredients?: Partial<MealsIngredientsState>
}

type SetupResult = ReturnType<typeof render> & {
  mockUseMealsIngredients: typeof mockUseMealsIngredients
  mockUseFormContext: typeof mockUseFormContext
  mockToastError: typeof mockToastError
}

const defaultMealsIngredients: MealsIngredientsState = {
  ingredients: defaultIngredients,
  isLoading: false,
  isError: false,
  error: null,
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseMealsIngredients.mockReset()
  mockUseFormContext.mockReset()
  mockToastError.mockReset()

  const mealsIngredients: MealsIngredientsState = {
    ingredients:
      options.mealsIngredients?.ingredients ?? defaultMealsIngredients.ingredients,
    isLoading:
      options.mealsIngredients?.isLoading ?? defaultMealsIngredients.isLoading,
    isError: options.mealsIngredients?.isError ?? defaultMealsIngredients.isError,
    error:
      options.mealsIngredients?.error !== undefined
        ? options.mealsIngredients.error
        : defaultMealsIngredients.error,
  }

  mockUseMealsIngredients.mockReturnValue(mealsIngredients)

  const form = createMockForm({
    area: options.area ?? "Italian",
    initialMainIngredient: options.initialMainIngredient ?? "",
  })
  mockUseFormContext.mockReturnValue({ form })

  const utils = render(createElement(Step2))

  return {
    ...utils,
    mockUseMealsIngredients,
    mockUseFormContext,
    mockToastError,
  }
}

describe("Step2", () => {
  it("calls useMealsIngredients with the selected area and shows the combobox, background image, and ingredient options when loaded", async () => {
    setup({ area: "Mexican" })

    expect(mockUseMealsIngredients).toHaveBeenCalledWith("Mexican")

    expect(
      screen.getByRole("combobox", { name: mainIngredientLabel }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /Decorative background ingredients\.png/ }),
    ).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole("combobox", { name: mainIngredientLabel }))

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Chicken" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Tomato" })).toBeInTheDocument()
    })
  })

  it("disables the combobox while ingredients are loading", () => {
    setup({
      mealsIngredients: {
        ingredients: [],
        isLoading: true,
        isError: false,
        error: null,
      },
    })

    const combobox = screen.getByRole("combobox", { name: mainIngredientLabel })
    expect(combobox).toBeDisabled()
  })

  it("shows no items when the ingredient list is empty", async () => {
    setup({
      mealsIngredients: {
        ingredients: [],
        isLoading: false,
        isError: false,
        error: null,
      },
    })

    fireEvent.mouseDown(screen.getByRole("combobox", { name: mainIngredientLabel }))

    await waitFor(() => {
      expect(screen.getByText("No items found.")).toBeInTheDocument()
    })
  })

  it("when loading meals or ingredients fails, logs the error and shows a toast", () => {
    const err = new Error("network")
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    setup({
      mealsIngredients: {
        ingredients: [],
        isLoading: false,
        isError: true,
        error: err,
      },
    })

    expect(consoleSpy).toHaveBeenCalledWith(err)
    expect(mockToastError).toHaveBeenCalledWith(
      "Failed to load meals or ingredients for this area. Please try again later.",
      expect.objectContaining({
        id: "meals-ingredients-query-error",
        position: "top-right",
      }),
    )

    consoleSpy.mockRestore()
  })

  it("shows a validation error after blur when the main ingredient is empty", async () => {
    setup({ initialMainIngredient: "" })

    const combobox = screen.getByRole("combobox", { name: mainIngredientLabel })
    fireEvent.focus(combobox)
    fireEvent.blur(combobox)

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toHaveTextContent("Main ingredient is required")
    })
  })
})
