'use client'
import useSideBar from '@/context/use-sidebar'
import { cn } from '@/lib/utils'
import React from 'react'
import MaxMenu from './maximized-menu'
import { MinMenu } from './minimized-menu'

type Props = {
  domains:
    | {
        id: string
        name: string
        icon: string
      }[]
    | null
    | undefined
}

const SideBar = ({ user } : any) => {
  const { expand, onExpand, page } = useSideBar()

  const onSignOut = () => {};

  return (
    <div
      className={cn(
        'bg-cream dark:bg-neutral-950 h-screen w-[60px] fill-mode-forwards fixed md:relative',
        expand == undefined && '',
        expand == true
          ? 'animate-open-sidebar'
          : expand == false && 'animate-close-sidebar'
      )}
    >
      {expand ? (
        <MaxMenu
          current={page!}
          onExpand={onExpand}
          onSignOut={onSignOut}
          user={user}
        />
      ) : (
        <MinMenu
          onShrink={onExpand}
          current={page!}
          onSignOut={onSignOut}
          user={user}
        />
      )}
    </div>
  )
}

export default SideBar
