import React from 'react'
import { Tabs } from "../ui/tabs";
import CreateStake from './create-stake';
import ListStake from './list-stake';

function StakeTabs() {
    const tabs = [
        {
          title: "Create Staking Pool",
          value: "create",
          content: (
             <CreateStake />
          ),
        },
        {
          title: "Your Staked List",
          value: "stake list",
          content: (
             <ListStake />
          ),
        },
      ];
  return (
    <div  className='md:w-[500px] md:p-0 p-4 w-[90vw]'>
       <Tabs tabs={tabs} />
    </div>
  )
}

export default StakeTabs