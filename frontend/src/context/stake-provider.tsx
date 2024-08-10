"use client";
import React from "react";
import useStake from "@/hooks/useStake";

type Context = ReturnType<typeof useStake>;

export const StakeContext = React.createContext<Context>({} as Context);

interface Props {
  children: React.ReactNode;
}

export const StakeProvider = ({ children }: Props) => {
  const value = useStake();

  return (
    <StakeContext.Provider value={value}>{children}</StakeContext.Provider>
  );
};
