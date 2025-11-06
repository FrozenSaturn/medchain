"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function Hero() {
  return (
    <WavyBackground
      containerClassName="h-screen"
      colors={["#388E3C", "#4CAF50", "#81C784", "#66BB6A", "#A5D6A7"]}
      backgroundFill="black"
      blur={15}
      speed="slow"
      waveOpacity={0.3}
      waveWidth={60}
    >
      {/* Main content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          {/* Main heading */}
          <h1 className="font-sf-pro text-5xl lg:text-8xl font-bold mb-1 text-[#FAFAFA] tracking-widest leading-tight">
            MecChain
          </h1>
          <p className="text-lg text-gray-300 mb-5 font-sf-pro-regular tracking-widest">
            Your modern healthcare solution
          </p>

          {/* CTA Button */}
          <Link href="/dashboard" passHref>
            <button className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#388E3C] focus:ring-offset-2 focus:ring-offset-black hover:scale-105 transition-transform duration-300">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#388E3C_0%,#4CAF50_25%,#81C784_50%,#4CAF50_75%,#388E3C_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-12 py-3 text-lg font-sf-pro-regular text-[#FAFAFA] backdrop-blur-3xl">
                Launch App
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Optional: Scroll indicator */}
    </WavyBackground>
  );
}
