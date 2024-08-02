import Image from 'next/image'
import React from 'react'

type MenuLogoProps = {
  onClick(): void
}

export const MenuLogo = ({ onClick }: MenuLogoProps) => {
  return (
     
       <Image onClick={onClick} src="/images/logo-tab.png" alt="log" width={25} height={25}/>
    
  )
}
