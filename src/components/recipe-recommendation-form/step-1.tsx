import { useQuery } from "@tanstack/react-query"
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

import { areaFieldSchema, useFormContext } from "./formContext"
import { getAreas } from "@/http/get-areas"

const Step1 = () => {
  const { data } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
    staleTime: Infinity, // cache until params change
  })

  const { form } = useFormContext()

  const countries = data?.meals.map((country) => country.strArea)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <FieldGroup className="shrink-0">
        <form.Field
          name="area"
          validators={{
            onChange: areaFieldSchema,
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Cusine/Area</FieldLabel>

                <Combobox
                  items={countries ?? []}
                  value={field.state.value || null}
                  onValueChange={(value) => {
                    field.handleChange(value ?? "")
                  }}
                >
                  <ComboboxInput
                    className="w-full"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    placeholder="Select an area"
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
        className="min-h-0 flex-1 rounded-md bg-[url('/countries.png')] bg-contain bg-center bg-no-repeat opacity-[0.02] dark:opacity-[0.07]"
      />
    </div>
  )
}

export default Step1
