import { useCallback } from "react"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFormContext, type FormValues } from "./formContext"
import { MealsIngredientsSync } from "./meals-ingredients-sync"
import { STEP_FIELDS, steps } from "./constants"
import { useStepsStore } from "@/store/steps"
import { cn } from "@/lib/utils"

const RecipeRecommendationForm = () => {
  const { currentStep, setCurrentStep } = useStepsStore()
  const { form } = useFormContext()

  const validateFieldBeforeNext = useCallback(
    async (fieldName: keyof FormValues) => {
      form.setFieldMeta(fieldName, (prev) => ({
        ...prev,
        isTouched: true,
      }))
      await form.validateField(fieldName, "change")
      const meta = form.getFieldMeta(fieldName)
      return Boolean(meta?.isValid)
    },
    [form]
  )

  const onClickNext = async () => {
    const field = STEP_FIELDS[currentStep]
    if (field !== undefined && !(await validateFieldBeforeNext(field))) {
      return
    }

    setCurrentStep(currentStep + 1)
  }

  return (
    <Card className="h-[min(44rem,85vh)] min-h-0">
      <MealsIngredientsSync />
      <CardHeader>
        <CardTitle>Form</CardTitle>
        <CardDescription>
          Pick your cuisine and ingredient in two steps. Live search updates as
          you type—get a fresh recipe idea instantly!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-full min-h-0 w-full flex-1 flex-col px-6 py-6">
          <Stepper
            value={currentStep}
            onValueChange={setCurrentStep}
            className="flex h-full min-h-0 w-full flex-1 flex-col"
          >
            <StepperNav>
              {steps.map((step) => (
                <StepperItem key={step.stepNum} step={step.stepNum}>
                  <StepperTrigger asChild>
                    <StepperIndicator className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:bg-primary data-[state=completed]:text-white data-[state=inactive]:text-gray-500"></StepperIndicator>
                  </StepperTrigger>
                  {steps.length > step.stepNum && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="flex min-h-0 flex-1 flex-col text-sm">
              <form
                className="flex min-h-0 flex-1 flex-col"
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                {steps.map((step) => (
                  <StepperContent
                    className="flex min-h-0 w-full flex-1 flex-col"
                    key={step.stepNum}
                    value={step.stepNum}
                  >
                    <div
                      className={cn(
                        "flex min-h-0 w-full flex-1 flex-col px-6 py-12",
                        step.stepNum === 3 && "justify-center"
                      )}
                    >
                      <step.Component />
                    </div>
                  </StepperContent>
                ))}
              </form>
            </StepperPanel>

            <div className="mt-auto flex items-center justify-between gap-2.5">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep !== steps.length && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClickNext}
                  disabled={currentStep === steps.length}
                >
                  Next
                </Button>
              )}
            </div>
          </Stepper>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecipeRecommendationForm
