import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormExtendedApi,
} from "@tanstack/react-form"

type SyncSlot<TFormData> = FormValidateOrFn<TFormData> | undefined
type AsyncSlot<TFormData> = FormAsyncValidateOrFn<TFormData> | undefined

/**
 * TanStack `useForm` API for a form with zod (or compatible) `validators.onSubmit`.
 * Pass your inferred values type and submit validator, e.g.
 * `RecipeFormApi<FormValues, typeof formSchema>`.
 */
declare type RecipeFormApi<
  TFormData,
  TSubmitValidator extends FormValidateOrFn<TFormData> | undefined,
> = ReactFormExtendedApi<
  TFormData,
  SyncSlot<TFormData>,
  SyncSlot<TFormData>,
  AsyncSlot<TFormData>,
  SyncSlot<TFormData>,
  AsyncSlot<TFormData>,
  TSubmitValidator,
  AsyncSlot<TFormData>,
  SyncSlot<TFormData>,
  AsyncSlot<TFormData>,
  AsyncSlot<TFormData>,
  unknown
>
