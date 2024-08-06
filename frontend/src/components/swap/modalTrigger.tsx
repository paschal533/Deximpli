import React, { ReactNode } from 'react'
import { Card } from '../ui/card'
import { CloudIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import Modal from '../mondal'
import TokenModal from './tokenModal'
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input"
import TestTokenModal from './test-token'
import TestNetworkModal from './network'

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
        case 'test-token':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            > 
               <TestTokenModal selectToken={selectToken} />  
            </Modal>
        )
      case 'network':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            >
              
              <TestNetworkModal selectToken={selectToken} />
              
            </Modal>
        )
      default:
        return <></>
    }
     
}

export default IntegrationTrigger
