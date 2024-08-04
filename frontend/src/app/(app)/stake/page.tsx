import InfoBar from '@/components/infobar'
import StakeTabs from '@/components/stake/tabs'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {

  return (
    <>
      <InfoBar /> 
      <div className="w-full align-middle place-content-center justify-center items-center flex">
        <StakeTabs />
      </div>
    </>
  )
}

export default Page
