import { useHistoryStore } from "@/store/history"
import MealsEmptyList from "../meals-empty-list"
import MealsList from "../meals-list"

const LikedMeals = () => {
  const { likedMeals } = useHistoryStore()

  return (
    <div>
      {likedMeals.length === 0 && (
        <MealsEmptyList
          title="No Liked Recipes Yet"
          description="No liked recipes yet. Try your first recipe to build your history!"
        />
      )}
      {likedMeals.length > 0 && <MealsList mealsHistory={likedMeals} />}
    </div>
  )
}

export default LikedMeals
