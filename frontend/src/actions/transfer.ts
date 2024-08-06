"use client"
import { client } from '@/lib/prisma'
import { sendTransactionEmail } from "@/lib/mail"

export const sendMail = async (fullname : string, receiverEmail: string, sendValue: string) => {
   await sendTransactionEmail(fullname, receiverEmail, sendValue)
}

export const onLoginUser = async (address : any) => {
  if (!address) return;
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          walletAddress: address,
        }
      })
      if (authenticated) {
        return { status: 200,  authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}

export const onCompleteUserRegistration = async (
  email: string,
  walletAddress: string,
  contractAddress: string,
) => {
  try {
    const registered = await client.user.create({
      data: {
        email,
        walletAddress,
        contractAddress,
      },
      select: {
        email: true,
        walletAddress: true,
        id: true,
        contractAddress: true,
      },
    })

    if (registered) {
      return { status: 200, user: registered }
    }
  } catch (error) {
    return { status: 400 }
  }
}