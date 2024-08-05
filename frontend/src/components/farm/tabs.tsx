"use client"
import React from 'react'
import { Tabs } from "../ui/tabs";
import CreateFarmingPool from './create-farm';
import ListFarmingPools from './list-farm';

function FarmTabs() {
    const tabs = [
      {
        title: "Farming Pool List",
        value: "farm list",
        content: (
           <ListFarmingPools />
        ),
      },
        {
          title: "Create Farming Pool",
          value: "create",
          content: (
             <CreateFarmingPool />
          ),
        },
      ];
  return (
    <div  className='!max-w-[1000px] p-4 w-full'>
       <Tabs tabs={tabs} />
    </div>
  )
}

export default FarmTabs