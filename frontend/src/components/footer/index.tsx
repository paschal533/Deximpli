"use client"
import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Slide, Fade } from "react-awesome-reveal";

const FooterItem = ({ title, items} : any) => {
    return (
        <div>
            <h1 className='text-xl font-bold'>{title}</h1>
             <div className='space-y-3 mt-4'>
             {items.map((item : any, i : any) => (<p className='font-medium' key={i}>{item}</p>))}
             </div>
        </div>
    )
}

function Footer() {
  return (
    <div className=' p-4 md:pt-20 md:px-20 mt-12 justify-center z-50 w-full flex flex-col text-white bg-gradient-to-r from-[#6C17C1] to-[#D7009A]'>
        <div className='grid mt-4 grid-cols-2 md:grid-cols-5 gap-12'>
        <Slide damping={0.1}>
        <Link href="/">
                <div className='flex text-center'>
                  <Fade damping={0.1}>
                    <Image src="/images/footer-logo.png" alt="logo" width={30} height={30} />
                    </Fade>
                    <Fade damping={0.1} className='text-greenColor font-bold text-2xl ml-2'>DEXIMPLI</Fade>
                </div>
            </Link>
        </Slide>
        <Slide damping={0.2}>
        <FooterItem title="Company" items={["Privacy Policy", "Copyright", "Press", "Term and Condtion"]} />
        </Slide>
        <Slide damping={0.3}>
        <FooterItem title="Contact" items={["Headquarters", "Manager", "Phone", "Email"]} />
        </Slide>
        <Slide damping={0.4}>
        <FooterItem title="Resources" items={["Blog", "Newsletter", "Support", "Help Center"]} /> 
        </Slide>
        <Slide damping={0.5}>
        <FooterItem title="Legal" items={["Terms", "Privacy", "Github", "Help"]} />
        </Slide>
           
          
           
        </div>

        <div className='h-[1px] bg-white w-full mt-10 rounded-lg' />

        <div className='justify-between w-full mt-6 flex flex-wrap'>
          <Fade damping={0.1} className='text-md font-medium hidden md:block'>Copyrigh @ 2024 DEXIMPLI</Fade>
          <Link href="/">
                <div className='flex text-center'>
                  <Fade damping={0.1}>
                    <Image src="/images/footer-logo.png" alt="logo" width={30} height={30} />
                    </Fade>
                    <Fade damping={0.1} className='text-greenColor font-bold text-2xl ml-2'>DEXIMPLI</Fade>
                </div>
            </Link>
          <div className='flex space-x-2'>
            <Fade damping={0.1} className='p-2 rounded-full bg-[#2f3030] text-white'><FaFacebookF height={20} width={20} /></Fade>
            <Fade damping={0.1} className='p-2 rounded-full bg-[#2f3030] text-white'><FaTwitter height={20} width={20} /></Fade>
            <Fade damping={0.1} className='p-2 rounded-full bg-[#2f3030] text-white'><FaInstagram height={20} width={20} /></Fade>
            <Fade damping={0.1} className='p-2 rounded-full bg-[#2f3030] text-white'><FaLinkedinIn height={20} width={20} /></Fade>
        </div>
        </div>
         
    </div>
  )
}

export default Footer