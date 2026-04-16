import { useHistoryStore } from "@/store/history"
import MealsEmptyList from "../meals-empty-list"
import MealsList from "../meals-list"

const AllMeals = () => {
  const { allMeals } = useHistoryStore()

  return (
    <div>
      {allMeals.length === 0 && (
        <MealsEmptyList
          title="No Recipes Yet"
          description="No recommendations yet. Try your first recipe to build your history!"
        />
      )}

      {allMeals.length > 0 && <MealsList mealsHistory={allMeals} />}
    </div>
  )
}

export default AllMeals
