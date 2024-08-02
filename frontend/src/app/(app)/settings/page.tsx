import InfoBar from '@/components/infobar'
import DarkModetoggle from '@/components/settings/dark-mode'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
  return (
    <>
      <InfoBar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0 flex flex-col gap-10">
        <DarkModetoggle />
      </div>
    </>
  )
}

export default Page
