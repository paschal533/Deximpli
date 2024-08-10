"use client";
import React from "react";
import useLoan from "@/hooks/useLoan";

type Context = ReturnType<typeof useLoan>;

export const LoanContext = React.createContext<Context>({} as Context);

interface Props {
  children: React.ReactNode;
}

export const LoanProvider = ({ children }: Props) => {
  const value = useLoan();

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};
