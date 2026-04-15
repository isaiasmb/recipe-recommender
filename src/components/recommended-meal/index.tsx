import { ThumbsDown, ThumbsUp } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "@/components/image"
import type { Meal } from "@/schemas"
import { useHistory } from "@/components/recipe-recommendation-form/hooks/useHistory"

type RecommendedMealProps = {
  recommendedMeals: Meal[]
}

const RecommendedMeal = ({ recommendedMeals }: RecommendedMealProps) => {
  const { like, dislike } = useHistory()

  const firstMeal = recommendedMeals[0]

  if (!recommendedMeals.length || !firstMeal) {
    return null
  }

  const recommendedMeal = firstMeal

  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm">
          Recommended Meal
        </h1>
        <p className="text-sm text-muted-foreground">
          We found a meal that matches your preferences
        </p>
      </div>

      <Card className="relative mx-auto w-full max-w-sm pt-0">
        <Image
          src={recommendedMeal.strMealThumb}
          alt={recommendedMeal.strMeal}
        />
        <CardHeader>
          <CardAction>
            <Badge variant="secondary">{recommendedMeal.strCategory}</Badge>
          </CardAction>
          <CardTitle>
            <a
              href={recommendedMeal.strSource}
              target="_blank"
              rel="noopener noreferrer"
            >
              {recommendedMeal.strMeal}
            </a>
          </CardTitle>
          <CardDescription>{recommendedMeal.strArea}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2">
          <span>Do you like it?</span>
          <Button
            className="text-green-500"
            variant="outline"
            onClick={() => like(recommendedMeal)}
          >
            <ThumbsUp />
          </Button>
          <Button
            className="text-red-500"
            variant="outline"
            onClick={() => dislike(recommendedMeal)}
          >
            <ThumbsDown />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RecommendedMeal
