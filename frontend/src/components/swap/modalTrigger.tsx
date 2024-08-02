import React, { ReactNode } from 'react'
import { Card } from '../ui/card'
import { CloudIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import Modal from '../mondal'
import { IntegrationModalBody } from './mondal-body'
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input"

const IntegrationTrigger = ({ children, title }: { children: ReactNode, title : string }) => {
  const placeholders = [
    "Search name of token",
    "Paste address of token",
  ];
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <Modal
      title={title}
      type="Integration"
      trigger={children}
    >
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <Separator orientation="horizontal" />
       
    </Modal>
  )
}

export default IntegrationTrigger
