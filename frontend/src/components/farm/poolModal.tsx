"use client"
import React, { useContext, useEffect, useState } from 'react'
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
import { FarmContext } from '@/context/farm-provider';

function PoolModal({ selectToken, erc20Only, customTokens }: { selectToken : any, erc20Only? : any, customTokens? : any }) {
    const {  network, loadingTokens } =  useContext(SwapContext)
    const {tokens, LoadingPoolTokens} = useContext(FarmContext)
    const [tokenList, setTokenList] = useState<Array<any>>(tokens)

    const placeholders = [
        "Search name of Pool",
        "Paste address of Pool",
    ];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTokenList(tokens.filter((token : any) => {
            return token.name?.toLowerCase().includes(e.target.value.toLowerCase()) || token.address?.toLowerCase().includes(e.target.value.toLowerCase());
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
      <Typography>Please select a token</Typography>
      <Separator className='mt-1' orientation="horizontal" />
    </div>
    <div>
      <List className='w-full h-full overflow-y-auto overflow-x-hidden'>
        {!LoadingPoolTokens ? tokenList.length > 0 ? tokenList.map((item : any, index : any) =>
         <DialogClose key={index} className='flex-col w-full'>
          <ListItem
            className='hover:bg-cream space-x-2 rounded-lg w-full flex'
            onClick={() => { selectToken(item) }}>
            <Image src={item.logo ? item.logo : network.image} alt="eth" width={30} height={30} />
            <div className='w-full flex-col'>
              <h1 className='font-semibold text-sm'>{item.name}</h1>
              <p className='text-xs'>{item.symbol}</p>
            </div>
          </ListItem>
        </DialogClose>) : <div className='text-md mt-2 font-medium'>
            Token name or address not found
          </div>
        : (<div className='w-full flex justify-center items-center mt-6 align-middle'><CircularProgress sx={{ color: '#D7009A' }} /></div>)}
      </List>
    </div>
    </div>
  )
}

export default PoolModal