"use client"
import React from "react";
import useSwap from "@/hooks/useSwap";

type Context = ReturnType<typeof useSwap>;

export const SwapContext = React.createContext<Context>({} as Context);

interface Props {
  children: React.ReactNode;
}

export const SwapProvider = ({ children }: Props) => {
  const value = useSwap();

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
};