"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
        setVisible(true); // Show navbar when scrolled down
      } else {
        setIsScrolled(false);
        setVisible(false); // Hide navbar when at top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Timeline", link: "#timeline" },
    { name: "Contribute", link: "#contribute" },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-[#388E3C]/20 rounded-full bg-black/90 backdrop-blur-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          isScrolled && "bg-black/95"
        )}
      >
        {/* Logo */}
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logomain.png"
                width={32}
                height={32}
                alt="DAVA Logo"
              />
            </div>
            <span className="font-sf-pro-bold text-lg text-[#FAFAFA] transition-colors duration-300 group-hover:text-[#388E3C]">
              DAVA
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {navItems.map((navItem, idx) => (
            <a
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-[#FAFAFA]/80 items-center flex space-x-1 hover:text-[#388E3C] transition-colors duration-200 font-sf-pro-regular text-sm"
              )}
            >
              <span className="text-sm">{navItem.name}</span>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/dashboard" passHref>
          <button className="border text-sm font-sf-pro-regular relative border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 px-4 py-2 rounded-full transition-all duration-200">
            <span>Launch App</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-[#388E3C] to-transparent h-px" />
          </button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
