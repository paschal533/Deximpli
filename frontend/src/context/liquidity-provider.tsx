"use client";
import React from "react";
import useLiquidity from "@/hooks/useLiquidity";

type Context = ReturnType<typeof useLiquidity>;

export const LiquidityContext = React.createContext<Context>({} as Context);

interface Props {
  children: React.ReactNode;
}

export const LiquidityProvider = ({ children }: Props) => {
  const value = useLiquidity();

  return (
    <LiquidityContext.Provider value={value}>
      {children}
    </LiquidityContext.Provider>
  );
};
