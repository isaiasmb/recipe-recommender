import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import LikedMeals from "./liked-meals"
import DislikedMeals from "./disliked-meals"
import AllMeals from "./all-meals"

type HistoryType = "all" | "liked" | "disliked"

const RecipeHistory = () => {
  const [toggleValue, setToggleValue] = useState<HistoryType>("liked")

  return (
    <Card className="h-[min(44rem,85vh)] min-h-0">
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          Your saved recommendations. Filter by liked/disliked, sorted newest
          first.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden pb-6">
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={toggleValue}
            value={toggleValue}
            onValueChange={(value: HistoryType) => {
              if (value) {
                setToggleValue(value)
              }
            }}
            variant="outline"
            spacing={2}
            className="shrink-0"
          >
            <ToggleGroupItem value="liked" aria-label="Liked">
              Liked
            </ToggleGroupItem>
            <ToggleGroupItem value="disliked" aria-label="Disliked">
              Disliked
            </ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="All">
              All
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="scrollbar-themed min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-border/60 bg-muted/25 px-3 py-2 shadow-inner">
            {toggleValue === "liked" && <LikedMeals />}
            {toggleValue === "disliked" && <DislikedMeals />}
            {toggleValue === "all" && <AllMeals />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecipeHistory
