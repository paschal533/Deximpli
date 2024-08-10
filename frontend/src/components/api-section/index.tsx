"use client";
import React from "react";
import Image from "next/image";
import { Slide, Fade } from "react-awesome-reveal";
import { motion, useAnimation } from "framer-motion";
import Lottie from "react-lottie";
import Link from "next/link";
import ArrowRight from "@/lotties/arrow-right.json";
import { AnimatedBeamDemo } from "../Beam";

const cubeOptions = {
  loop: true,
  autoplay: true,
  animationData: ArrowRight,

  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ApiSection() {
  return (
    <div className="justify-center mt-16 flex bg-cream md:h-[100%] h-full w-full">
      <div className="w-full p-4 md:pl-20 md:p-10 flex max-w-[1300px] h-full flex-wrap items-center content-center place-content-center justify-center align-middle">
        <div className="md:mt-0 md:w-[45%] mt-14 items-center content-center place-content-center w-full h-full flex-col justify-center align-middle">
          <Slide damping={0.2}>
            <h1 className="text-4xl font-bold text-[#191A1A] mb-8">
              SDK Integration for Programmers
            </h1>
            <Fade className="text-xl mr-6 text-[#191A1A]">
              An SDK enabling developers to integrate Deximpli's email-based
              wallet into their dapps for seamless, secure web3 transactions as
              simple as using a credit card.
            </Fade>
            <Link href="/dashboard">
              {" "}
              <motion.button
                whileHover={{ backgroundColor: "#6becec" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r mt-12 from-[#6C17C1] to-[#D7009A] px-4 py-4 rounded-lg text-white"
                style={{
                  border: "none",
                  top: 10,
                  height: "42px",
                  color: "white",
                  backgroundColor: "#33CCCC",
                }}
              >
                <div
                  className="flex justify-center items-center"
                  style={{ height: "100%" }}
                >
                  <span className="font-bold">Launch App</span>
                  <div style={{ width: "28px" }}>
                    <Lottie options={cubeOptions} height={60} width={40} />
                  </div>
                </div>
              </motion.button>
            </Link>
          </Slide>
        </div>
        <Slide
          direction="right"
          damping={0.1}
          className="md:mt-0 md:block hidden md:w-[50%] w-full mt-8"
        >
          {/* <Image src="/images/api.png" width={500} height={500} alt="banner-image" /> */}
          <AnimatedBeamDemo />
        </Slide>
        <Slide
          direction="right"
          damping={0.1}
          className="md:mt-0 md:hidden block md:w-[50%] w-full mt-8"
        >
          {/* <Image src="/images/api.png" width={350} height={300} alt="banner-image" /> */}
          <AnimatedBeamDemo />
        </Slide>
      </div>
    </div>
  );
}

export default ApiSection;
