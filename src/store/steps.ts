import { create } from "zustand"

export type StepsState = {
  currentStep: number
  setCurrentStep: (currentStep: number) => void
}

export const useStepsStore = create<StepsState>((set) => ({
  currentStep: 1,
  setCurrentStep: (currentStep: number) => set({ currentStep }),
}))
