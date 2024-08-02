import SideBar from '@/components/sidebar'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const OwnerLayout = async ({ children }: Props) => {
  const authenticated = {}

  return (
      <div className="flex h-screen w-full">
        <SideBar user={authenticated} />
        <div className="w-full h-screen flex flex-col pl-20 md:pl-4">
            {children}

        </div>
      </div>
  )
}

export default OwnerLayout
