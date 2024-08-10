"use client";
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import { motion, useAnimation } from "framer-motion";
import Lottie from "react-lottie";
import Link from "next/link";
import ArrowRight from "@/lotties/arrow-right.json";

const cubeOptions = {
  loop: true,
  autoplay: true,
  animationData: ArrowRight,

  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function NavBar() {
  return (
    <main className="justify-center fixed z-50 flex drop-shadow-2xl w-[100vw] p-4 md:px-20">
      <div className="flex z-50 gap-5 top-3 w-full max-w-[1300px] justify-between items-center px-7 py-1 font-bold h-[60px] bg-[#fff] rounded-2xl leading-[154.5%] max-md:flex-wrap max-md:px-5">
        <div className="flex gap-1.5 justify-center self-stretch my-auto text-2xl tracking-tighter text-neutral-700">
          <Image
            src="/images/logo.png"
            alt="LOGO"
            sizes="100vw"
            style={{
              width: "120px",
              height: "auto",
            }}
            width={0}
            height={0}
          />
        </div>
        <ul className="gap-5 justify-between self-stretch my-auto text-sm leading-5 text-neutral-700 max-md:flex-wrap max-md:max-w-full font-semibold hidden md:flex">
          <li>Home</li>
          <li>Features</li>
          <li>Testimonials</li>
          <li>FAQs</li>
        </ul>
        <Link href="/swap">
          {" "}
          <motion.button
            whileHover={{ backgroundColor: "#6becec" }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#6C17C1] to-[#D7009A] px-4 py-2 rounded-lg text-white"
            style={{
              border: "none",
              top: 10,
              height: "36px",
              color: "white",
              backgroundColor: "#33CCCC",
            }}
          >
            <div
              className="flex justify-center items-center"
              style={{ height: "100%" }}
            >
              <span>Launch App</span>
              <div style={{ width: "28px" }}>
                <Lottie options={cubeOptions} height={60} width={40} />
              </div>
            </div>
          </motion.button>
        </Link>
      </div>
    </main>
  );
}

export default NavBar;
