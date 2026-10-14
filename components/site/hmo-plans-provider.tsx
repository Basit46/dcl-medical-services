"use client";

import { createContext, useContext, type ReactNode } from "react";

const HmoPlansContext = createContext<string[]>([]);

export function HmoPlansProvider({
  plans,
  children,
}: {
  plans: string[];
  children: ReactNode;
}) {
  return (
    <HmoPlansContext.Provider value={plans}>{children}</HmoPlansContext.Provider>
  );
}

export function useHmoPlans() {
  return useContext(HmoPlansContext);
}