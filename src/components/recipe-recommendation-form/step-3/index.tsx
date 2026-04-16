import { useEffect } from "react"
import { UtensilsCrossed } from "lucide-react"
import useRecommendedMealsStore from "@/store/recommended-meals"
import { useStepsStore } from "@/store/steps"
import RecommendedMeal from "@/components/recommended-meal"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { useRecommendedMeals } from "../hooks/useRecommendedMeals"
import { useFormContext } from "../formContext"

const Step3 = () => {
  const recommendedMeals = useRecommendedMeals()
  const { setRecommendedMeals } = useRecommendedMealsStore()
  const { form } = useFormContext()
  const { setCurrentStep } = useStepsStore()

  useEffect(() => {
    if (recommendedMeals.length === 0) return
    setRecommendedMeals(recommendedMeals)
  }, [recommendedMeals, setRecommendedMeals])

  const handleClickNewIdea = () => {
    setCurrentStep(1)
    // Bare `reset()` restores `defaultValues` from mount (URL-derived), so fields
    // would keep the old query. Clear explicitly so URL sync can strip params.
    form.reset({ area: "", mainIngredient: "" })
    setRecommendedMeals([])
  }

  return (
    <div>
      {recommendedMeals.length > 0 && (
        <RecommendedMeal recommendedMeals={recommendedMeals} />
      )}
      {recommendedMeals.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle>
              No recommended meals found with your preferences
            </EmptyTitle>
            <EmptyDescription>
              Try again with different preferences
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button onClick={handleClickNewIdea}>New idea</Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}

export default Step3
