import { useEffect } from "react"
import { toast } from "sonner"

import { mainIngredientFieldSchema, useFormContext } from "./formContext"
import { useMealsIngredients } from "./hooks/useMealsIngredients"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import BgImage from "../bg-image"

const Step2 = () => {
  const { form } = useFormContext()
  const area = form.getFieldValue("area")
  const { ingredients, isLoading, isError, error } = useMealsIngredients(area)

  useEffect(() => {
    if (!isError) {
      return
    }

    console.error(error)
    toast.error(
      "Failed to load meals or ingredients for this area. Please try again later.",
      {
        id: "meals-ingredients-query-error",
        position: "top-right",
      }
    )
  }, [isError, error])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <FieldGroup>
        <form.Field
          name="mainIngredient"
          validators={{
            onChange: mainIngredientFieldSchema,
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Main ingredient</FieldLabel>

                <Combobox
                  loading={isLoading}
                  items={ingredients ?? []}
                  value={field.state.value ?? null}
                  onValueChange={(value) => {
                    field.handleChange(value ?? "")
                  }}
                >
                  <ComboboxInput
                    className="w-full"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    placeholder="Select the main ingredient"
                    autoFocus
                  />

                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <BgImage imagePath="ingredients.png" />
    </div>
  )
}

export default Step2
