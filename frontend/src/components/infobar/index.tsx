"use client"
import React from 'react'
import BreadCrumb from './bread-crumb'
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Props = {}


const InfoBar = (props: Props) => {
  return (
    <div className="flex w-full justify-between items-center md:pr-4 pr-0 py-1 mb-8 ">
      <BreadCrumb />
      <div className="gap-3 md:flex hidden items-center">
         <ConnectButton />
      </div>
    </div>
  )
}

export default InfoBar
