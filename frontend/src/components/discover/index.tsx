"use client";
import React from "react";
import { Fade, Slide } from "react-awesome-reveal";
import { string } from "zod";
import { WobbleCardDemo } from "../wobbleCard";

function Discover() {
  return (
    <div className="justify-center flex md:h-[100%] h-full w-full">
      <main className="mt-16 max-w-[1300px] p-4 md:pl-20 justify-center items-center place-content-center w-full md:pr-20">
        <Fade damping={0.1}>
          <h1 className="text-4xl font-bold text-center">
            Discover What Makes Deximpli Exceptional
          </h1>
        </Fade>
        <Fade
          damping={0.1}
          className="w-full flex mb-8 justify-center text-center"
        >
          <p className="md:w-[600px] text-lg text-center mt-6">
            {" "}
            By leveraging email addresses and cutting-edge technologies like
            zk-rollups and Account Abstraction, Deximpli removes the complexity
            associated with traditional crypto wallets, attracting new users and
            accelerating DeFi adoption.
          </p>
        </Fade>
        <WobbleCardDemo />
      </main>
    </div>
  );
}

export default Discover;
