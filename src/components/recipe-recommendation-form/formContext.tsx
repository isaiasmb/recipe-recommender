import { formOptions, useForm } from "@tanstack/react-form"
import { createContext, useContext, type ReactNode } from "react"
import { z } from "zod"
import type { RecipeFormApi } from "@/types"

/** Single-field schema for step 1; reused by the area field and the full form schema. */
export const areaFieldSchema = z
  .string()
  .min(1, { message: "Area is required" })

/** Single-field schema for step 2; reused by the main ingredient field and the full form schema. */
export const mainIngredientFieldSchema = z
  .string()
  .min(1, { message: "Main ingredient is required" })

const formSchema = z.object({
  area: areaFieldSchema,
  mainIngredient: mainIngredientFieldSchema,
})

export type FormValues = z.infer<typeof formSchema>

const FormContext = createContext<{
  form: RecipeFormApi<FormValues, typeof formSchema>
} | null>(null)

export const useFormContext = () => {
  const value = useContext(FormContext)
  if (!value) {
    throw new Error("useFormContext must be used within a FormContextProvider")
  }
  return value
}

const emptyDefaults: FormValues = {
  area: "",
  mainIngredient: "",
}

const recipeFormDefaults = formOptions({
  defaultValues: emptyDefaults,
  validators: {
    onSubmit: formSchema,
  },
})

type UrlSearchDefaults = Pick<FormValues, "area" | "mainIngredient">

export const FormContextProvider = ({
  children,
  urlSearch,
}: {
  children: ReactNode
  /** When set (e.g. from the router), seeds the form to match the URL. */
  urlSearch?: UrlSearchDefaults
}) => {
  const defaultValues: FormValues = {
    area: urlSearch?.area ?? emptyDefaults.area,
    mainIngredient: urlSearch?.mainIngredient ?? emptyDefaults.mainIngredient,
  }

  const form = useForm({
    ...recipeFormDefaults,
    defaultValues,
  })

  return (
    <FormContext.Provider value={{ form }}>{children}</FormContext.Provider>
  )
}
