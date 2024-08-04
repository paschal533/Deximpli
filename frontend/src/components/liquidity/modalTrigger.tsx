import React, { ReactNode } from 'react'
import { Card } from '../ui/card'
import { CloudIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import Modal from '../mondal'
import TokenModal from './tokenModal'
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input"
import RemoveLiquidity from './remove-liquidity'
import AdjustLiquidity from './adjust-liquidity'

const IntegrationTrigger = ({ children, title, selectToken, type }: { children: ReactNode, title : string, selectToken? : any, type : string }) => {

  const placeholdersNetwork = [
    "Search name of network",
    "Paste address of network",
  ];
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
    switch (type) {
      case 'token':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            > 
               <TokenModal selectToken={selectToken} />  
            </Modal>
        )
      case 'Remove-pair':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            >
              <RemoveLiquidity liquidityPair={selectToken} />
              
            </Modal>
        )
        case 'add-liquidity':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            >
              <AdjustLiquidity liquidityPair={selectToken} />
              
            </Modal>
        )
      default:
        return <></>
    }
     
}

export default IntegrationTrigger
