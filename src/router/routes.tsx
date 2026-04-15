import { useStore } from "@tanstack/react-form"
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { useEffect, useLayoutEffect } from "react"
import RecipeHistory from "@/components/recipe-history"
import RecipeRecommendationForm from "@/components/recipe-recommendation-form"
import {
  FormContextProvider,
  useFormContext,
} from "@/components/recipe-recommendation-form/formContext"
import { useStepsStore } from "@/store/steps"
import { recipeSearchSchema } from "./recipe-search-schema"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: recipeSearchSchema,
  component: HomePage,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function RecipeUrlSync() {
  const { form } = useFormContext()
  const search = indexRoute.useSearch()
  const navigate = indexRoute.useNavigate()
  const setCurrentStep = useStepsStore((s) => s.setCurrentStep)
  const values = useStore(form.store, (state) => state.values)
  const currentStep = useStepsStore((s) => s.currentStep)

  // Apply URL → form + step in layout so Zustand is updated before the
  // "push to URL" effect runs (avoids stale `currentStep` e.g. default 1 vs ?step=3).
  useLayoutEffect(() => {
    form.reset({
      area: search.area,
      mainIngredient: search.mainIngredient,
    })
    setCurrentStep(search.step)
  }, [search.area, search.mainIngredient, search.step, form, setCurrentStep])

  useEffect(() => {
    const step = useStepsStore.getState().currentStep
    const latest = form.state.values
    if (
      latest.area === search.area &&
      latest.mainIngredient === search.mainIngredient &&
      step === search.step
    ) {
      return
    }
    navigate({
      to: "/",
      search: {
        area: latest.area,
        mainIngredient: latest.mainIngredient,
        step,
      },
      replace: true,
    })
  }, [
    values.area,
    values.mainIngredient,
    currentStep,
    search.area,
    search.mainIngredient,
    search.step,
    navigate,
    form,
  ])

  return null
}

function HomePage() {
  const search = indexRoute.useSearch()

  return (
    <div className="space-y-4 py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <div>
          <h1>Recipe Recommender</h1>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-start">
        <main className="min-w-0 w-full lg:w-3/5">
          <FormContextProvider
            urlSearch={{
              area: search.area,
              mainIngredient: search.mainIngredient,
            }}
          >
            <RecipeUrlSync />
            <RecipeRecommendationForm />
          </FormContextProvider>
        </main>

        <aside className="min-w-0 w-full lg:w-2/5">
          <RecipeHistory />
        </aside>
      </div>
    </div>
  )
}
