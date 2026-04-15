import { createContext, useContext, useState, type ReactNode } from "react"

export type DataValues = {
  areas: string[]
  ingredients: string[]
  setAreas: (areas: string[]) => void
  setIngredients: (ingredients: string[]) => void
}

const DataContext = createContext<DataValues>(null as unknown as DataValues)

export const useDataContext = () => {
  const value = useContext(DataContext)
  if (!value) {
    throw new Error("useDataContext must be used within a DataContextProvider")
  }
  return value
}

const defaultValues: DataValues = {
  areas: [],
  ingredients: [],
  setAreas: () => {},
  setIngredients: () => {},
}

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [areas, setAreas] = useState<string[]>(defaultValues.areas)
  const [ingredients, setIngredients] = useState<string[]>(
    defaultValues.ingredients
  )

  const contextValue = {
    areas,
    ingredients,
    setAreas,
    setIngredients,
  }

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  )
}
