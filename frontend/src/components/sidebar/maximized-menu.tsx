import { SIDE_BAR_MENU } from '@/constants/menu'
import { LogOut, Menu, MonitorSmartphone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import MenuItem from './menu-item'
import Link from 'next/link'

type Props = {
  onExpand(): void
  current: string
  onSignOut(): void
  user: any
}

const MaxMenu = ({ current, onExpand, onSignOut, user }: Props) => {
  return (
    <div className="py-3 px-4 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <Link className='flex' href="/"><Image
          src="/images/logo-tab.png"
          alt="LOGO"
          sizes="100vw"
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          width={30}
          height={30}
        />
        <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#D7009A] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center ml-1 text-2xl font-bold leading-none text-transparent">Deximpli</h1>
        </Link>
        <Menu
          className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
          onClick={onExpand}
        />
      </div>
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-3">MENU</p>
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="max"
              {...menu}
              key={key}
              current={current}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-md text-gray-500 mb-3">OPTIONS</p>
          <MenuItem
            size="max"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
          <MenuItem
            size="max"
            label="Mobile App"
            icon={<MonitorSmartphone />}
          />
        </div>
      </div>
    </div>
  )
}

export default MaxMenu
