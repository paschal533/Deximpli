"use client"
import React from 'react'
import { Fade, Slide } from "react-awesome-reveal";
import { string } from 'zod';
import { WobbleCardDemo } from "../wobbleCard"

function Discover() {
  return (
    <div className='justify-center flex md:h-[100%] h-full w-full'>
    <main className='mt-16 max-w-[1300px] p-4 md:pl-20 justify-center items-center place-content-center w-full md:pr-20'>
        <Fade damping={0.1}><h1 className='text-4xl font-bold text-center'>Discover What Makes Deximpli Exceptional</h1></Fade>
        <Fade damping={0.1} className='w-full flex mb-8 justify-center text-center'><p className='md:w-[600px] text-lg text-center mt-6'> By leveraging email addresses and cutting-edge technologies like zk-rollups and Account Abstraction, Deximpli removes the complexity associated with traditional crypto wallets, attracting new users and accelerating DeFi adoption.</p></Fade>
        <WobbleCardDemo />
        {/*<div className="grid grid-cols-1 mt-12 md:grid-cols-3 gap-4">
            <Slide><main className={`bg-[#FFFFFF] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#31BED1]`}>Email Address Integration</h1>
                <p className={`text-[#555555] mt-6`}>Send crypto with ease using recipient email addresses only, making the process more straightforward and accessible for all users</p>
            </main></Slide>
            <Slide><main className={`bg-[#3446D7] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#FFFFFF]`}>Uniswap Integration</h1>
                <p className={`text-[#FFFFFF] mt-6`}>Integration with Uniswap allows users to directly swap tokens within Deximpli, eliminating the need for multiple platforms.</p>
            </main></Slide>
            <Slide><main className={`bg-[#161F68] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#FFFFFF]`}>Flashloan Triangle Arbitrate</h1>
                <p className={`text-[#FFFFFF] mt-6`}>Through a user-friendly interface, users can analyze arbitrage opportunities across multiple decentralized exchanges and execute profitable trades.</p>
            </main></Slide>
            <Slide><main className={`bg-[#6C17C1] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#FFFFFF]`}>AI Powered Prediction</h1>
                <p className={`text-[#FFFFFF] mt-6`}>AI helps optimize flashloan strategies, personalize user experiences, and enhance security by analyzing smart contracts for anomalies.</p>
            </main></Slide>
            <Slide><main className={`bg-[#D7009A] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#FFFFFF]`}>Portfolio Mastery</h1>
                <p className={`text-[#FFFFFF] mt-6`}>Easily monitor your portfolio’s performance, diversify strategically, and optimize your crypocurrency holdings with Deximpli.</p>
            </main></Slide>
            <Slide><main className={`bg-[#FFFFFF] hover:scale-110 duration-100 delay-100 w-full align-middle flex justify-center flex-col p-6 h-[300px] md:w-[300px] rounded-2xl drop-shadow-lg`}>
                <h1 className={`text-2xl font-bold text-[#D7009A]`}>Global Community</h1>
                <p className={`text-[#555555] mt-6`}>A dedicated community platform that fosters collaboration, education, enlightenment and support for users of all experience levels.</p>
            </main></Slide>
        </div>*/}
    </main>
    </div>
  )
}

export default Discover