import InfoBar from '@/components/infobar'
import Transfer from '@/components/transfer'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {

  return (
    <>
      <InfoBar></InfoBar>
      <Transfer />
    </>
  )
}

export default Page
