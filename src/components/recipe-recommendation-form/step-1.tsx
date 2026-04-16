import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
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
import BgImage from "../bg-image"

const Step1 = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
    staleTime: Infinity, // cache until params change
  })

  useEffect(() => {
    if (!isError) {
      return
    }

    console.error(error)
    toast.error("Failed to load cuisine areas. Please try again later.", {
      id: "areas-query-error",
      position: "top-right",
    })
  }, [isError, error])

  const { form } = useFormContext()

  const countries = data?.meals.map((country) => country.strArea)

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <FieldGroup>
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
                  loading={isLoading}
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

      <BgImage imagePath="countries.png" />
    </div>
  )
}

export default Step1
