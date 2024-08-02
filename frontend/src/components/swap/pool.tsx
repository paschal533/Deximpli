"use client"
import React from 'react'
import { ArrowDownUp, ChevronDown } from "lucide-react"
import { ConnectBTN } from '../customWallet'
import Image from 'next/image'
import EthImage from "../../../public/images/eth.png"
import IntegrationTrigger from './modalTrigger'

function Pool() {

  return (
    <div>
    <div className='md:w-[500px] md:p-0 p-4 w-[90vw]'>
        <section className='h-[100px] bg-cream rounded-xl px-4 py-2  w-full'>
          <div className='text-md h-4 font-semibold text-gray-500'></div>
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' placeholder='0' className='bg-none text-3xl w-1/2 font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type='token'
              >
                 <div className='!w-28 cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={EthImage} alt="eth" width={25} height={20} /> ETH <ChevronDown className='mt-[1px]' /></div>
              </IntegrationTrigger>
          </div>
        </section>
        <div className="w-full justify-center items-center flex"><section className='bg-cream justify-center border-white absolute rounded-xl border-4 items-center flex w-10 h-10'><ArrowDownUp /></section></div>
        <section className='h-[100px] mt-2 bg-cream  px-4 py-2 rounded-xl  w-full'>
        <div className='text-md h-4 font-semibold text-gray-500'></div>
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' placeholder='0' className='bg-none w-1/2 text-3xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type='token'
              >
                <div className='!w-36 cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl'>
                  Select token <ChevronDown className='mt-[1px]' />
                 </div>
              </IntegrationTrigger>
          </div>
        </section>
        <section>
            <ConnectBTN />
        </section>
    </div>
    </div>
  )
}

export default Pool