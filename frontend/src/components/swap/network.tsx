import React, { useContext, useState } from 'react'
import { SwapContext } from '@/context/swap-provider';
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input"
import { Separator } from '../ui/separator'

import {
    CircularProgress,
    List,
    ListItem,
    Typography,
  } from "@mui/material";
import Image from 'next/image';
import { DialogClose } from "../ui/dialog"

function TestNetworkModal({ selectToken }: { selectToken : any }) {
    const { network, loadingTokens } =  useContext(SwapContext)

    const networks = [
        {"image": "/images/base.png", "name":"BASE", "id":84532, "address": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a", "CCIP_BnM": "0x88A2d74F47a237a62e7A51cdDa67270CE381555e", "CCIP_LnM": "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c"},
        {"image": "/images/optimism.png", "name":"OPTIMISM", "id":11155420, "CCIP_BnM": "0x8aF4204e30565DF93352fE8E1De78925F6664dA7", "CCIP_LnM": "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a", "address": "0xb4BF84b079E080Be165174357cEdC10FACAAB9Ae", "chainSelector" : "5224473277236331295"},
        {"image": "/images/celo.png", "name":"CELO", "id":44787, "address": "0xa2EF6cCB0b4A6c23FBb4e56e839456613bF03970", "CCIP_BnM": "0x7e503dd1dAF90117A1b79953321043d9E6815C72", "CCIP_LnM": "0x7F4e739D40E58BBd59dAD388171d18e37B26326f", "chainSelector" : "3552045678561919002"},
        {"image": "/images/mode.png", "name":"MODE", "id":919, "address": "0x2Db56C7de28B1B78b623715c98f74156790f82c8", "CCIP_BnM": "0xB9d4e1141E67ECFedC8A8139b5229b7FF2BF16F5", "CCIP_LnM": "0x86f9Eed8EAD1534D87d23FbAB247D764fC725D49", "chainSelector" : "829525985033418733"},
    ]

    const [networkList, setNetworkList] = useState(networks)
     
    const placeholders = [
        "Search name of Network",
        "Paste address of Network",
    ];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNetworkList(networks.filter((Network : any) => {
            return Network.name?.toLowerCase().includes(e.target.value.toLowerCase());
        }))
      };
       
  return (
    <div>
       <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={() => {}}
            />
    <div className='mt-2'>
      <Typography>Please select a Network</Typography>
      <Separator className='mt-1' orientation="horizontal" />
    </div>
    <div>
      <List className='w-full h-full overflow-y-auto overflow-x-hidden'>
        {!loadingTokens ? networkList.length > 0 ? networkList.map((item : any, index : any) =>
         <DialogClose key={index} className='flex-col w-full'>
          <ListItem
            className='hover:bg-cream space-x-2 rounded-lg w-full flex'
            onClick={() => { selectToken(item) }}>
            <Image src={item.image} alt="eth" width={30} height={30} />
            <div className='w-full flex-col'>
              <h1 className='font-semibold text-sm'>{item.name}</h1>
            </div>
          </ListItem>
        </DialogClose>) : <div className='text-md mt-2 font-medium'>
            network name not found
          </div>
        : (<div className='w-full flex justify-center items-center mt-6 align-middle'><CircularProgress sx={{ color: '#D7009A' }} /></div>)}
      </List>
    </div>
    </div>
  )
}

export default TestNetworkModal