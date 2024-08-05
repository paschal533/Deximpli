"use client"
import React from "react";
import useFarm from "@/hooks/useFarm";

type Context = ReturnType<typeof useFarm>;

export const FarmContext = React.createContext<Context>({} as Context);

interface Props {
  children: React.ReactNode;
}

export const FarmProvider = ({ children }: Props) => {
  const value = useFarm();

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};