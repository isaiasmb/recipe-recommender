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

const Step2 = () => {
  const { form } = useFormContext()
  const area = form.getFieldValue("area")
  const { ingredients, isLoading } = useMealsIngredients(area)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <FieldGroup className="shrink-0">
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
      <div
        aria-hidden
        className="min-h-0 flex-1 rounded-md bg-[url('/ingredients.png')] bg-contain bg-center bg-no-repeat opacity-[0.02] dark:opacity-[0.07]"
      />
    </div>
  )
}

export default Step2
