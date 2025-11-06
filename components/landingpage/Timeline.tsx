"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import {
  User,
  Calendar,
  Bot,
  Shield,
  Award,
  FileText,
  Search,
  CreditCard,
  Heart,
  Zap,
  Rocket,
  Smartphone,
  Building,
} from "lucide-react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}

const Timeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const timelineData: TimelineEntry[] = [
    {
      title: "Platform Launch",
      icon: Rocket,
      content: (
        <div>
          <p className="text-[#FAFAFA]/80 text-sm md:text-base leading-relaxed font-sf-pro-regular">
            Initial release of DAVA healthcare platform with core features
            including doctor search, appointment booking, and basic patient
            management system.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Core Features
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Doctor Search
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Appointments
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "AI Integration",
      icon: Bot,
      content: (
        <div className="space-y-4">
          <p className="text-[#FAFAFA]/80 text-sm md:text-base leading-relaxed font-sf-pro-regular">
            Advanced AI health assistant with symptom analysis, personalized
            health recommendations, and intelligent appointment scheduling.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              AI Assistant
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Symptom Analysis
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Smart Scheduling
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Digital Records",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-[#FAFAFA]/80 text-sm md:text-base leading-relaxed font-sf-pro-regular">
            Secure digital medical records system with blockchain-powered NFTs
            for verifiable health data ownership and sharing.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Medical NFTs
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Blockchain
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Secure Storage
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Mobile Apps",
      icon: Smartphone,
      content: (
        <div className="space-y-4">
          <p className="text-[#FAFAFA]/80 text-sm md:text-base leading-relaxed font-sf-pro-regular">
            Native mobile applications for iOS and Android with cross-platform
            synchronization, push notifications, and offline capabilities.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              iOS App
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Android App
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Sync
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Enterprise Platform",
      icon: Building,
      content: (
        <div className="space-y-4">
          <p className="text-[#FAFAFA]/80 text-sm md:text-base leading-relaxed font-sf-pro-regular">
            Comprehensive enterprise solution for hospitals and healthcare
            institutions with advanced analytics, administrative controls, and
            team collaboration features.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Hospital Management
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Analytics
            </span>
            <span className="px-3 py-1 bg-[#388E3C]/20 text-[#388E3C] text-xs rounded-full font-sf-pro-medium">
              Team Collaboration
            </span>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section id="timeline" className="bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#388E3C]/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#388E3C]/10 rounded-full filter blur-3xl animate-pulse [animation-delay:'2s']"></div>
      </div>

      <div
        className="w-full font-sans md:px-10 relative z-10"
        ref={containerRef}
      >
        

        <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
          {timelineData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex justify-start pt-10 md:pt-40 md:gap-10"
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-[#388E3C] flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-[#FAFAFA]" />
                  </div>
                  <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-[#FAFAFA] font-sf-pro-bold">
                    {item.title}
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-[#FAFAFA] font-sf-pro-bold">
                    {item.title}
                  </h3>
                  {item.content}
                </div>
              </div>
            );
          })}
          <div
            style={{
              height: height + "px",
            }}
            className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-[#388E3C]/30 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#388E3C] via-[#4CAF50] to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
