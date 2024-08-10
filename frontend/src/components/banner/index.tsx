"use client";
import React from "react";
import NavBar from "../navbar";
import { motion, useAnimation } from "framer-motion";
import Lottie from "react-lottie";
import Link from "next/link";
import ArrowRight from "@/lotties/arrow-right.json";
import Image from "next/image";
import { Slide } from "react-awesome-reveal";
import RetroGrid from "@/components/magicui/retro-grid";

const cubeOptions = {
  loop: true,
  autoplay: true,
  animationData: ArrowRight,

  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Banner() {
  return (
    <main className="h-[100%] relative justify-center flex bg-cream w-full p-4 md:px-20 ">
      <RetroGrid />

      <section className="md:mt-32 mt-32 mb-10 w-full flex flex-wrap  max-w-[1300px] h-full items-center content-center place-content-center justify-center align-middle">
        <section className="w-full flex flex-col md:w-1/2">
          <Slide>
            <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#D7009A] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none text-transparent">
              A Smarter Way{" "}
            </h1>
            <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#D7009A] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none text-transparent">
              To Trade Crypto
            </h1>

            <p className="line-clamp-4 text-lg mt-8 font-medium">
              Experience the future of effortless cryptocurrency transactions
              with our platform – swap, stake, farm, borrow and send tokens
              instantly to anyone via email, eliminating the need for complex
              wallet addresses.{" "}
            </p>

            <Link href="/swap">
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
        </section>
        <section className="w-full md:block hidden md:w-1/2">
          <Slide direction="right">
            <Image
              src="/images/banner.png"
              width={550}
              height={550}
              alt="banner"
            />
          </Slide>
        </section>
        <section className="w-full md:hidden mt-16 block md:w-1/2">
          <Slide direction="right">
            <Image
              src="/images/banner.png"
              width={350}
              height={400}
              alt="banner"
            />
          </Slide>
        </section>
      </section>
    </main>
  );
}

export default Banner;
