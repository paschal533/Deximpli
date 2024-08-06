import React from 'react'
import { Tabs } from "../ui/tabs";
import CreateStake from './create-stake';
import ListStake from './list-stake';

function StakeTabs() {
    const tabs = [
      {
        title: "Staking Pool List",
        value: "stake list",
        content: (
           <ListStake />
        ),
      },
        {
          title: "Create Staking Pool",
          value: "create",
          content: (
             <CreateStake />
          ),
        },
      ];
  return (
    <div className='!max-w-[1000px] p-4 w-full'>
       <Tabs tabs={tabs} />
    </div>
  )
}

export default StakeTabs