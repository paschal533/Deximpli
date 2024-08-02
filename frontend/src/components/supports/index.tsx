"use client"
import React from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { Fade } from "react-awesome-reveal";
import NumberTicker from "@/components/magicui/number-ticker";

const CryptoCard = ({ image, name} : any) => {
    return(
        <div className='w-full border-1 border-white px-2 py-2 rounded-xl drop-shadow-lg bg-white text-black'>
            <div className='w-full text-center items-center justify-center align-middle flex'>
                <Image src={image} alt="test" height={50} width={50} className='rounded-full' />
                <div className='w-full flex-col text-center ml-2'>
                    <h1 className='text-xl font-medium'>{name}</h1>
                </div>
            </div>
        </div>
    )
}

const cryptoSupportData = [
    {"image": "/images/btc.png", "name":"BITCOIN"},
    {"image": "/images/ether.png", "name":"ETHEREUM"},
    {"image": "/images/celo.png", "name":"CELO"},
    {"image": "/images/matic.png", "name":"POLYGON"},
    {"image": "/images/mode.png", "name":"MODE"},
    {"image": "/images/base.png", "name":"BASE"},
    {"image": "/images/optimism.png", "name":"OPTIMISM"},
    {"image": "/images/bnb.png", "name":"BINANCE"},
    {"image": "/images/uniswap.png", "name":"UNISWAP"},
]

const firstRow = cryptoSupportData.slice(0, cryptoSupportData.length / 2);
const secondRow = cryptoSupportData.slice(cryptoSupportData.length / 2);

function Support() {
  return (
     <main className='mt-8 '>
         <h1 className='text-center w-full text-3xl md:text-5xl'><Fade damping={0.1}>Cross-Chain Bridged with over</Fade> <Fade damping={0.1} className='font-bold'><span><NumberTicker value={50} />+ blockchains</span></Fade></h1>


         <div className="relative flex mt-14 mb-6  w-full flex-col items-center justify-center overflow-hidden  ">
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                 <CryptoCard key={review.name} image={review.image} name={review.name} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                 <CryptoCard key={review.name} image={review.image} name={review.name} />
                ))}
            </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
       </div>
     </main>
  )
}

export default Support