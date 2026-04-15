import { CookingPot } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type MealsEmptyListProps = {
  title: string
  description?: string
}

const MealsEmptyList = ({ title, description }: MealsEmptyListProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CookingPot />
        </EmptyMedia>
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}

export default MealsEmptyList
