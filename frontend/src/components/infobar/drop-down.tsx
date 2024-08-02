import React, { useContext} from 'react'
import { DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'
import Image from 'next/image'
import { SwapContext } from '@/context/swap-provider'

function DropDown() {
  const cryptoSupportData = [
        {"image": "/images/base.png", "name":"BASE"},
        {"image": "/images/optimism.png", "name":"OPTIMISM"},
        {"image": "/images/celo.png", "name":"CELO"},
        {"image": "/images/mode.png", "name":"MODE"},
  ]

  const { setNetwork } = useContext(SwapContext);
  return (
    <DropdownMenuContent className='space-y-2' >
        {cryptoSupportData.map((data : any, idx : any) => ( 
          <DropdownMenuItem onClick={() => setNetwork(data)} key={idx} className='w-full flex space-x-2'>
            <Image src={data.image} height={25} width={25} alt='network-logo' />
            <h1 className='text-md font-semibold'>{data.name}</h1>
          </DropdownMenuItem>
        ))}
    </DropdownMenuContent>
  )
}

export default DropDown