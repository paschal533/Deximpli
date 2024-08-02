"use server"
import InfoBar from '@/components/infobar'
import React from 'react'
import Swap from '@/components/swap'

type Props = {}

const Page = async (props: Props) => {

  return (
    <>
      <InfoBar />
      <div className="w-full align-middle place-content-center justify-center items-center flex">
        <Swap/>
      </div>
    </>
  )
}

export default Page
