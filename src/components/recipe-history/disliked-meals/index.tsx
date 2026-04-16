import { useHistoryStore } from "@/store/history"
import MealsEmptyList from "../meals-empty-list"
import MealsList from "../meals-list"

const DislikedMeals = () => {
  const { dislikedMeals } = useHistoryStore()

  return (
    <div>
      {dislikedMeals.length === 0 && (
        <MealsEmptyList
          title="No Disliked Recipes Yet"
          description="No disliked recipes yet. Try your first recipe to build your history!"
        />
      )}

      {dislikedMeals.length > 0 && <MealsList mealsHistory={dislikedMeals} />}
    </div>
  )
}

export default DislikedMeals
