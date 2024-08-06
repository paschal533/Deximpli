import InfoBar from '@/components/infobar'
import TransferTabs from '@/components/transfer/tabs'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {

  return (
    <>
      <InfoBar />
      <div className="w-full align-middle place-content-center justify-center items-center flex">
       <TransferTabs />
      </div>
    </>
  )
}

export default Page
