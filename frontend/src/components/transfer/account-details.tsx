"use client"
import React, {useContext, useState, useEffect} from 'react'
import { publicClient } from "@/lib/wallet";
import * as API from "@/services/api";
import { formatEther } from 'viem'
import VerificationMenu from './verification-menu'
import { SwapContext } from '@/context/swap-provider'
import { onLoginUser } from '@/actions/transfer'
import DashboardCard from '../loan/cards'
import CalIcon from '@/icons/cal-icon'
import PersonIcon from '@/icons/person-icon'
import { TransactionsIcon } from '@/icons/transactions-icon'
import { DollarSign } from 'lucide-react'

function AccountDetails() {
   const { address } = useContext(SwapContext)

   const [balance, setBalance] = useState<number>(0)
   const [authenticated, setAuthenticated] = useState<any>();

  useEffect(() => {
    const getBalance = async() => {
       if(address){
        const _authenticated = await onLoginUser(address)
        setAuthenticated(_authenticated)

        let balance = await publicClient.getBalance({
            address: address,
          })
        
          const balanceAsEther = formatEther(balance) 
          const currentExchangeRate = await API.getExchangeRate();
          const BalanceInUSD = parseFloat(balanceAsEther) * currentExchangeRate;
        
          setBalance(BalanceInUSD);
       }
    }

    getBalance();

  }, [address])

  return (
    <div className='w-full flex'>
        {address ? authenticated?.status !== 200 ? <VerificationMenu user={authenticated} /> 
        : 
        <div>
            <div className="flex gap-5 flex-wrap">
          <DashboardCard
            value={balance.toFixed(2).toString()}
            sales
            title="Active Balance"
            icon={<PersonIcon />}
          />
          <DashboardCard
            value={"0"}
            sales
            title="Credit Balance"
            icon={<CalIcon />}
          />
          <DashboardCard
            value={'0'}
            sales
            title="Debit Balance"
            icon={<DollarSign />}
          />
        </div>
        </div> 
        : 
        <p className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'>Please connect your wallect to view Account Information</p>}
    </div>
  )
}

export default AccountDetails