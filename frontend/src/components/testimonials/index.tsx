"use client"
import React from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import MarQuee from "react-fast-marquee";
import { Fade } from "react-awesome-reveal";

const TestimonialsCard = ({ image, name, role, speech} : any) => {
    return(
        <div className='w-[450px] h-[220px] p-4 rounded-xl bg-white drop-shadow-lg'>
            <div className='w-full flex'>
                <Image src={image} alt="test" height={50} width={50} className='rounded-full' />
                <div className='w-full flex-col ml-4'>
                    <h1 className='font-bold text-2xl'>{name}</h1>
                    <p className='font-light text-md'>{role}</p>
                </div>
            </div>
            <div>
                <p className='mt-4 text-md font-normal'>{speech}</p>
            </div>
        </div>
    )
}

const TestimonialsData = [
    {"image": "/images/Vector (1).png", "name":"David Marcus", "role": "Crypto Analyst", "speech": "I've been trading cryptocurrencies for years, and  Deximpli has become my go-to platform. The  real-time market data ensures I never miss a potential opportunity."},
    {"image": "/images/Vector (2).png", "name":"Mary Kent", "role": "Crypto Novice", "speech": "The flashloan triangle arbitrage feature on Deximpli is a game-changer for experienced traders like myself. I've been able to maximize my profits and take advantage of arbitrage opportunities like never before."},
    {"image": "/images/Vector (3).png", "name":"Lincoln Vann", "role": "Crypto Trader", "speech": "Thanks to this Deximpli's innovative approach, I've introduced friends and family to the world of cryptocurrencies with ease, simply by sending them digital assets to their email addresses."},
    {"image": "/images/Vector (4).png", "name":"Jane Ann", "role": "Crypto Analyst", "speech": "Sending cryptocurrencies via email? Mind-blowing! Deximpli has truly revolutionized the way we transact digital assets. I've sent crypto to friends with just their email addresses, making it incredibly convenient."},
    {"image": "/images/Vector (1).png", "name":"David Marcus", "role": "Crypto Analyst", "speech": "I've been trading cryptocurrencies for years, and  Deximpli has become my go-to platform. The  real-time market data ensures I never miss a potential opportunity."},
    {"image": "/images/Vector (2).png", "name":"Mary Kent", "role": "Crypto Novice", "speech": "The flashloan triangle arbitrage feature on Deximpli is a game-changer for experienced traders like myself. I've been able to maximize my profits and take advantage of arbitrage opportunities like never before."},
    {"image": "/images/Vector (3).png", "name":"Lincoln Vann", "role": "Crypto Trader", "speech": "Thanks to this Deximpli's innovative approach, I've introduced friends and family to the world of cryptocurrencies with ease, simply by sending them digital assets to their email addresses."},
    {"image": "/images/Vector (4).png", "name":"Jane Ann", "role": "Crypto Analyst", "speech": "Sending cryptocurrencies via email? Mind-blowing! Deximpli has truly revolutionized the way we transact digital assets. I've sent crypto to friends with just their email addresses, making it incredibly convenient."},
    {"image": "/images/Vector (1).png", "name":"David Marcus", "role": "Crypto Analyst", "speech": "I've been trading cryptocurrencies for years, and  Deximpli has become my go-to platform. The  real-time market data ensures I never miss a potential opportunity."},
    {"image": "/images/Vector (2).png", "name":"Mary Kent", "role": "Crypto Novice", "speech": "The flashloan triangle arbitrage feature on Deximpli is a game-changer for experienced traders like myself. I've been able to maximize my profits and take advantage of arbitrage opportunities like never before."},
    {"image": "/images/Vector (3).png", "name":"Lincoln Vann", "role": "Crypto Trader", "speech": "Thanks to this Deximpli's innovative approach, I've introduced friends and family to the world of cryptocurrencies with ease, simply by sending them digital assets to their email addresses."},
    {"image": "/images/Vector (4).png", "name":"Jane Ann", "role": "Crypto Analyst", "speech": "Sending cryptocurrencies via email? Mind-blowing! Deximpli has truly revolutionized the way we transact digital assets. I've sent crypto to friends with just their email addresses, making it incredibly convenient."},
]

const firstRow = TestimonialsData.slice(0, TestimonialsData.length / 2);
const secondRow = TestimonialsData.slice(TestimonialsData.length / 2);

function Testimonials() {
  return (
    <div>
    <div className='mt-8 md:mt-0 text-center p-4 md:p-20 justify-center items-center place-content-center w-full flex flex-col'>
        <div className="flex p-2 rounded-md">
            <h1 className='font-bold text-4xl'>What Our Users Say About Us</h1>
        </div>
        <div className='w-full md:w-[700px]' >
            <Fade damping={0.1} className='font-light text-xl mt-4'>These testimonials showcase Deximpli&apos;s dedication to driving innovation and pushing the boundaries of cryptocurrency trading across the globe. If you have a hard-time believing us, then listen to what our users say.</Fade>
        </div>
         
    </div>

    <div className="relative flex mb-6  w-full flex-col items-center justify-center overflow-hidden  ">
            <Marquee pauseOnHover className="[--duration:40s]">
                {firstRow.map((review) => (
                  <TestimonialsCard key={review.name} image={review.image} name={review.name} role={review.role} speech={review.speech} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:40s]">
                {secondRow.map((review) => (
                  <TestimonialsCard key={review.name} image={review.image} name={review.name} role={review.role} speech={review.speech} />
                ))}
            </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
       </div>
    </div>
  )
}

export default Testimonials