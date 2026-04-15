import { ThumbsDown, ThumbsUp } from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "@/components/image"
import type { HistoryItem } from "@/store/history"

type MealListItemProps = {
  mealHistory: HistoryItem
}

const MealListItem = ({ mealHistory }: MealListItemProps) => {
  if (!mealHistory) {
    return null
  }

  const { meal, liked } = mealHistory

  return (
    <Card className="flex-row items-stretch gap-0 py-0">
      <Image
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="aspect-square w-28 shrink-0 rounded-none rounded-l-xl sm:w-32"
      />

      <CardHeader className="min-w-0 flex-1 rounded-none rounded-r-xl py-4">
        <CardTitle className="flex items-center justify-between gap-2">
          <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
            {meal.strMeal}
          </a>
          <Badge variant="secondary">{meal.strCategory}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>{meal.strArea}</span>
        </CardDescription>
        <CardFooter className="items-right flex justify-end border-t-0 bg-transparent p-0">
          {liked && <ThumbsUp className="size-4 text-green-500" />}
          {!liked && <ThumbsDown className="size-4 text-red-500" />}
        </CardFooter>
      </CardHeader>
    </Card>
  )
}

export default MealListItem
