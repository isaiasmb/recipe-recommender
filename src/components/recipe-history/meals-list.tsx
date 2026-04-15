import type { HistoryItem } from "@/store/history"
import MealListItem from "./meal-list-item"

type MealsListProps = {
  mealsHistory: HistoryItem[]
}

const MealsList = ({ mealsHistory }: MealsListProps) => {
  if (!mealsHistory.length) {
    return null
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {mealsHistory.map((mealHistory) => (
        <MealListItem key={mealHistory.meal.idMeal} mealHistory={mealHistory} />
      ))}
    </div>
  )
}

export default MealsList
