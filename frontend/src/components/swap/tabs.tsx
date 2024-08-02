import React from 'react'
import { Tabs } from "../ui/tabs";
import Swap from '.';
import Pool from './pool';
import Bridge from './bridge';

function SwapTabs() {
    const tabs = [
        {
          title: "Swap",
          value: "swap",
          content: (
              <Swap />
          ),
        },
        {
          title: "Cross Chain Bridge",
          value: "bridge",
          content: (
             <Bridge />
          ),
        },
        {
            title: "Liquidity Pool",
            value: "Pool",
            content: (
                <Pool />
            ),
          },
      ];
  return (
    <div  className='md:w-[500px] md:p-0 p-4 w-[90vw]'>
       <Tabs tabs={tabs} />
    </div>
  )
}

export default SwapTabs