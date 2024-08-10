"use client";
import SideBar from "@/components/sidebar";
import React from "react";
import useSideBar from "@/context/use-sidebar";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

const OwnerLayout = async ({ children }: Props) => {
  const authenticated = {};
  const { expand, onExpand, page } = useSideBar();

  return (
    <div className="flex h-screen w-full">
      <SideBar user={authenticated} />
      <div
        className={cn(
          "w-full pl-0 h-screen flex flex-col",
          expand == undefined && "md:pl-[17rem]",
          expand == true ? "md:pl-[17rem]" : expand == false && "md:pl-[12rem]",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default OwnerLayout;
