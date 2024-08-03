'use client'
import useSideBar from '@/context/use-sidebar'
import React from 'react'
import { Loader } from '../loader'
import { Switch } from '../ui/switch'

type Props = {}

const BreadCrumb = (props: Props) => {
  const {
    expand,
    loading,
    onExpand,
    page,
    realtime,
  } = useSideBar()
  return (
    <div className="flex flex-col ">
      <div className="flex gap-5 items-center">
        <h2 className="text-3xl font-bold capitalize">{page}</h2>
      </div>
      <p className="text-gray-500 mt-2 text-sm">
        {page == 'settings'
          ? 'Manage your account settings, preferences and integrations'
          : page == 'swap'
          ? 'Swap anytime, anywhere.'
          : page == 'liquidity'
          ? 'Add liquidity, remove liquidity and earn rewards.'
          : page == 'loan'
          ? 'Borrow crypto and pay back later.'
          : page == 'stake'
          ? 'Stake crypto tokens and earn rewards'
          : page == 'transfer'
          ? 'Send Assets to anyone around the world using their email address.'
          : page == 'farm'
          ? 'Stake crypto tokens in the liquidity pool and earn rewards'
          : 'Modify settings'}
      </p>
    </div>
  )
}

export default BreadCrumb
