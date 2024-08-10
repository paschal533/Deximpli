import React from "react";
import NumberTicker from "@/components/magicui/number-ticker";

function Feactures() {
  return (
    <div className="justify-center text-[#121212] flex md:h-[100%] h-full w-full">
      <div className="w-full p-4 md:pl-20 md:p-10 md:flex hidden max-w-[1300px] h-full items-center content-center place-content-center justify-center align-middle">
        <div className="w-full text-center">
          <h1 className="text-5xl text-[#121212] font-extrabold">
            $<NumberTicker value={489} />
            B+
          </h1>
          <p className="mt-2 font-medium">Trade Volume</p>
        </div>
        <div className="w-full text-center">
          <h1 className="text-5xl font-extrabold">
            <NumberTicker value={71} />
            M+
          </h1>
          <p className="mt-2 font-medium">All Time Trades</p>
        </div>
        <div className="w-full text-center">
          <h1 className="text-5xl font-extrabold">
            <NumberTicker value={300} />+
          </h1>
          <p className="mt-2 font-medium">Integrations</p>
        </div>
        <div className="w-full text-center">
          <h1 className="text-5xl font-extrabold">
            <NumberTicker value={4400} />+
          </h1>
          <p className="mt-2 font-medium">Community Delegates</p>
        </div>
      </div>
    </div>
  );
}

export default Feactures;
