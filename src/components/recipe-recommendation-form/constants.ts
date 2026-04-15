import Step1 from "./step-1"
import Step2 from "./step-2"
import Step3 from "./step-3"
import type { FormValues } from "./formContext"

/** Step index → form field validated before leaving that step. */
export const STEP_FIELDS: Partial<Record<number, keyof FormValues>> = {
  1: "area",
  2: "mainIngredient",
}

export const steps = [
  {
    stepNum: 1,
    Component: Step1,
  },
  {
    stepNum: 2,
    Component: Step2,
  },
  {
    stepNum: 3,
    Component: Step3,
  },
]
