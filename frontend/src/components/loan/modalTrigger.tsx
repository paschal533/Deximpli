import React, { ReactNode } from 'react'
import Modal from '../mondal'
import Deposit from './deposit'
import Borrow from './borrow'
import Repay from './repay'
import Withdraw from './withdraw'

const IntegrationTrigger = ({ children, title, selectToken, type }: { children: ReactNode, title : string, selectToken? : any, type : string, erc20Only? : boolean, customTokens? : any }) => {
    switch (type) {
      case 'deposit':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            >
              
               <Deposit tokenAddress={selectToken} />
              
            </Modal>
        )
      case 'borrow':
        return (
          <Modal
              title={title}
              type="Integration"
              trigger={children}
            >
              
                <Borrow tokenAddress={selectToken} />
              
            </Modal>
        )
        case 'repay':
          return (
            <Modal
                title={title}
                type="Integration"
                trigger={children}
              >
                
                  <Repay tokenAddress={selectToken} />
                
              </Modal>
          )
          case 'withdraw':
            return (
              <Modal
                  title={title}
                  type="Integration"
                  trigger={children}
                >
                  
                    <Withdraw tokenAddress={selectToken} />
                  
                </Modal>
            )
      default:
        return <></>
    }
     
}

export default IntegrationTrigger
