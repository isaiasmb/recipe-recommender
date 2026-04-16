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
import Step1 from "./index"
import {
  mockGetAreas,
  mockToastError,
  mockUseFormContext,
  mockUseQuery,
} from "./mocks"

const areaLabel = /Cusine\/Area/i

const defaultMeals = [{ strArea: "Italian" }, { strArea: "Mexican" }]

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

function createMockForm(initialArea = "") {
  function Field({ name, validators, children }: MockFieldProps) {
    const [value, setValue] = useState(initialArea)
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

  return { Field }
}

type QueryState = {
  data?: { meals: { strArea: string }[] }
  isLoading: boolean
  isError: boolean
  error: Error | null
}

type SetupOptions = {
  initialArea?: string
  query?: Partial<QueryState>
}

type SetupResult = ReturnType<typeof render> & {
  mockUseQuery: typeof mockUseQuery
  mockUseFormContext: typeof mockUseFormContext
  mockGetAreas: typeof mockGetAreas
  mockToastError: typeof mockToastError
}

const defaultQuery: QueryState = {
  data: { meals: defaultMeals },
  isLoading: false,
  isError: false,
  error: null,
}

const setup = (options: SetupOptions = {}): SetupResult => {
  mockUseQuery.mockReset()
  mockUseFormContext.mockReset()
  mockGetAreas.mockReset()
  mockToastError.mockReset()

  const query: QueryState = {
    data: options.query?.data ?? defaultQuery.data,
    isLoading: options.query?.isLoading ?? defaultQuery.isLoading,
    isError: options.query?.isError ?? defaultQuery.isError,
    error:
      options.query?.error !== undefined ? options.query.error : defaultQuery.error,
  }

  mockUseQuery.mockReturnValue(query)

  const form = createMockForm(options.initialArea ?? "")
  mockUseFormContext.mockReturnValue({ form })

  const utils = render(createElement(Step1))

  return {
    ...utils,
    mockUseQuery,
    mockUseFormContext,
    mockGetAreas,
    mockToastError,
  }
}

describe("Step1", () => {
  it("wires useQuery to the areas query and passes getAreas as queryFn", () => {
    setup()

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["areas"],
        queryFn: mockGetAreas,
        staleTime: Infinity,
      }),
    )
  })

  it("shows the cuisine combobox with an accessible label, decorative background image, and area options when loaded", async () => {
    setup()

    expect(
      screen.getByRole("combobox", { name: areaLabel }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: /Decorative background countries\.png/ }),
    ).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole("combobox", { name: areaLabel }))

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Italian" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Mexican" })).toBeInTheDocument()
    })
  })

  it("disables the combobox while areas are loading", () => {
    setup({
      query: {
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      },
    })

    const combobox = screen.getByRole("combobox", { name: areaLabel })
    expect(combobox).toBeDisabled()
  })

  it("when the areas query fails, logs the error and shows a toast", () => {
    const err = new Error("network")
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    setup({
      query: {
        data: undefined,
        isLoading: false,
        isError: true,
        error: err,
      },
    })

    expect(consoleSpy).toHaveBeenCalledWith(err)
    expect(mockToastError).toHaveBeenCalledWith(
      "Failed to load cuisine areas. Please try again later.",
      expect.objectContaining({
        id: "areas-query-error",
        position: "top-right",
      }),
    )

    consoleSpy.mockRestore()
  })

  it("shows a validation error after blur when the area is empty", async () => {
    setup({ initialArea: "" })

    const combobox = screen.getByRole("combobox", { name: areaLabel })
    fireEvent.focus(combobox)
    fireEvent.blur(combobox)

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toHaveTextContent("Area is required")
    })
  })
})
