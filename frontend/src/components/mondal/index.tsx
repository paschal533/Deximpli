import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowBigLeftIcon, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

type Props = {
  trigger: React.ReactNode
  children: React.ReactNode
  title: string
  type?: 'Integration'
}

const Modal = ({
  trigger,
  children,
  title,
  type,
}: Props) => {
  switch (type) {
    case 'Integration':
      return (
        <Dialog>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex">
              <DialogTitle className="text-md font-md mb-4">{title}</DialogTitle>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )
    default:
      return (
        <Dialog>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">{title}</DialogTitle>
               
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )
  }
}

export default Modal
