import React, { useContext } from "react";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import Image from "next/image";
import { SwapContext } from "@/context/swap-provider";
import { useSwitchChain } from "wagmi";

function DropDown() {
  const cryptoSupportData = [
    { image: "/images/base.png", name: "BASE", id: 84532 },
    { image: "/images/optimism.png", name: "OPTIMISM", id: 11155420 },
    { image: "/images/celo.png", name: "CELO", id: 44787 },
    { image: "/images/mode.png", name: "MODE", id: 919 },
  ];

  const { setNetwork } = useContext(SwapContext);
  const { chains, switchChain } = useSwitchChain();
  return (
    <DropdownMenuContent className="space-y-2">
      {cryptoSupportData.map((data: any, idx: any) => (
        <DropdownMenuItem
          onClick={() => {
            setNetwork(data);
            switchChain({ chainId: data.id });
          }}
          key={idx}
          className="w-full flex space-x-2"
        >
          <Image src={data.image} height={25} width={25} alt="network-logo" />
          <h1 className="text-md font-semibold">{data.name}</h1>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );
}

export default DropDown;
