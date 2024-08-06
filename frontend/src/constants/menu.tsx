import ChatIcon from '@/icons/chat-icon'
import HelpDeskIcon from '@/icons/help-desk-icon'
import { ArrowRightLeft, Droplets, Blocks, Boxes, PlaneTakeoff, Settings, Send} from "lucide-react"

type SIDE_BAR_MENU_PROPS = {
  label: string
  icon: JSX.Element
  path: string
}

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
  {
    label: 'Swap tokens',
    icon: <ArrowRightLeft className='h-7 w-7 mr-2 text-sky-500' />,
    path: 'swap',
  },
  {
    label: 'Liquidity Pool',
    icon: <Droplets className='h-7 w-7 mr-2 text-orange' />,
    path: 'liquidity',
  },
  {
    label: 'Stake Tokens',
    icon: <Boxes className='h-7 w-7 mr-2 text-pink-700' />,
    path: 'stake',
  },
  {
    label: 'Email Transfer',
    icon:  <Send className='h-7 w-7 mr-2 text-violet-500'/>,
    path: 'transfer',
  },
  {
    label: 'Yield Farming',
    icon: <PlaneTakeoff className='h-7 w-7 mr-2 text-orange' />,
    path: 'farm',
  },
  {
    label: 'Cypto Loan',
    icon: <Blocks className='h-7 w-7 mr-2 text-blue-700' />,
    path: 'loan',
  },
  {
    label: 'Settings',
    icon: <Settings className='h-7 w-7 mr-2' />,
    path: 'settings',
  },
]

type TABS_MENU_PROPS = {
  label: string
  icon?: JSX.Element
}


export const EMAIL_MARKETING_HEADER = ['Id', 'Email', 'Answers', 'Domain']

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'chat',
    icon: <ChatIcon />,
  },
  {
    label: 'helpdesk',
    icon: <HelpDeskIcon />,
  },
]
