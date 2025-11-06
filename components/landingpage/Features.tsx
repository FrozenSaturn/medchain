"use client";

import React from "react";
import {
  User,
  Calendar,
  FileText,
  Search,
  CreditCard,
  Award,
  Bot,
  Shield,
  Clock,
  Heart,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import styled from "styled-components";
import { GlowingEffect } from "../../components/ui/glowing-effect";

const features = [
  {
    icon: User,
    title: "Find Trusted Doctors",
    description:
      "Connect with verified healthcare professionals across specialties. Browse profiles, read reviews, and book appointments seamlessly.",
    gradient: "from-[#388E3C] to-[#4CAF50]",
    socialIcons: ["👨‍⚕️", "🏥", "⭐"],
  },
  {
    icon: Calendar,
    title: "Smart Appointment Booking",
    description:
      "Schedule appointments with real-time availability. Get instant confirmations and automated reminders for your healthcare visits.",
    gradient: "from-[#388E3C] to-[#256029]",
    socialIcons: ["📅", "⏰", "🔔"],
  },
  {
    icon: Bot,
    title: "AI Health Assistant",
    description:
      "Get instant answers to health questions, symptom analysis, and personalized health recommendations powered by advanced AI.",
    gradient: "from-[#388E3C] to-[#81C784]",
    socialIcons: ["🤖", "🧠", "💡"],
  },
  {
    icon: FileText,
    title: "Digital Medical Records",
    description:
      "Secure, encrypted storage for all your medical documents. Access your health history anytime, anywhere with complete privacy.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const IconComponent = feature.icon;

  return (
    <StyledWrapper>
      <motion.div
        className="parent"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className={`card bg-gradient-to-br ${feature.gradient} relative`}>
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5">
              <IconComponent className="svg" size={20} />
            </span>
          </div>
          <div className="glass" />
          <div className="content">
            <span className="title">{feature.title}</span>
            <span className="text">{feature.description}</span>
          </div>
          <div className="bottom">
            <div className="social-buttons-container">
              {feature.socialIcons?.map((icon, i) => (
                <button key={i} className="social-button">
                  <span style={{ fontSize: "12px" }}>{icon}</span>
                </button>
              ))}
            </div>
            <div className="view-more">
              <button className="view-more-button">Learn more</button>
              <ArrowRight className="svg" size={15} />
            </div>
          </div>
        </div>
      </motion.div>
    </StyledWrapper>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      className="md:py-32 bg-black relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#388E3C]/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#388E3C]/10 rounded-full filter blur-3xl animate-pulse [animation-delay:'2s']"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#388E3C]/20 border border-[#388E3C]/30 mb-6">
            <Shield className="w-4 h-4 text-[#388E3C] mr-2" />
            <span className="text-sm font-medium text-[#388E3C] font-sf-pro-medium">
              Healthcare Innovation
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-[#FAFAFA] font-sf-pro-regular">
            Healthcare That{" "}
            <span style={{ color: "#388E3C" }} className="font-sf-pro-bold">
              Works For You
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Feature
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={<feature.icon />}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Call to action section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >

          <p className="text-[#FAFAFA]/80 text-lg max-w-2xl mx-auto font-sf-pro-regular">
            Join thousands of patients and healthcare providers who trust our
            platform for their medical needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const StyledWrapper = styled.div`
  .parent {
    width: 290px;
    height: 300px;
    perspective: 1000px;
  }

  .card {
    height: 100%;
    border-radius: 50px;
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: 0 8px 32px 0 rgba(56, 142, 60, 0.2);
    position: relative;
  }

  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 8px;
    border-radius: 55px;
    border-top-right-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(250, 250, 250, 0.1) 0%,
      rgba(250, 250, 250, 0.25) 100%
    );
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid #fafafa;
    border-bottom: 1px solid #fafafa;
    transition: all 0.5s ease-in-out;
  }

  .content {
    padding: 100px 60px 0px 30px;
    transform: translate3d(0, 0, 26px);
    position: relative;
    z-index: 10;
  }

  .content .title {
    display: block;
    color: #fafafa;
    font-weight: 900;
    font-size: 18px;
    line-height: 1.2;
  }

  .content .text {
    display: block;
    color: #fafafa;
    opacity: 0.85;
    font-size: 13px;
    margin-top: 15px;
    line-height: 1.4;
  }

  .bottom {
    padding: 10px 12px;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate3d(0, 0, 26px);
    z-index: 10;
  }

  .bottom .view-more {
    display: flex;
    align-items: center;
    width: 40%;
    justify-content: flex-end;
    transition: all 0.2s ease-in-out;
  }

  .bottom .view-more:hover {
    transform: translate3d(0, 0, 10px);
  }

  .bottom .view-more .view-more-button {
    background: none;
    border: none;
    color: #81c784;
    font-weight: bolder;
    font-size: 12px;
  }

  .bottom .view-more .svg {
    fill: none;
    stroke: #81c784;
    stroke-width: 3px;
    max-height: 15px;
  }

  .bottom .social-buttons-container {
    display: flex;
    gap: 10px;
    transform-style: preserve-3d;
  }

  .bottom .social-buttons-container .social-button {
    width: 30px;
    aspect-ratio: 1;
    padding: 5px;
    background: #fafafa;
    border-radius: 50%;
    border: none;
    display: grid;
    place-content: center;
    box-shadow: 0 2px 8px 0 rgba(56, 142, 60, 0.15);
    transition: all 0.2s ease-in-out;
  }

  .bottom .social-buttons-container .social-button:first-child {
    transition: transform 0.2s ease-in-out 0.4s,
      box-shadow 0.2s ease-in-out 0.4s;
  }

  .bottom .social-buttons-container .social-button:nth-child(2) {
    transition: transform 0.2s ease-in-out 0.6s,
      box-shadow 0.2s ease-in-out 0.6s;
  }

  .bottom .social-buttons-container .social-button:nth-child(3) {
    transition: transform 0.2s ease-in-out 0.8s,
      box-shadow 0.2s ease-in-out 0.8s;
  }

  .bottom .social-buttons-container .social-button:hover {
    background: #388e3c;
    color: #fafafa;
  }

  .bottom .social-buttons-container .social-button:active {
    background: rgb(255, 234, 0);
    color: black;
  }

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    transform-style: preserve-3d;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    right: 0;
    box-shadow: 0 2px 8px 0 rgba(56, 142, 60, 0.15);
    backdrop-filter: blur(5px);
    background: rgba(56, 142, 60, 0.15);
    transition: all 0.5s ease-in-out;
  }

  .logo .circle1 {
    width: 170px;
    transform: translate3d(0, 0, 20px);
    top: 8px;
    right: 8px;
  }

  .logo .circle2 {
    width: 140px;
    transform: translate3d(0, 0, 40px);
    top: 10px;
    right: 10px;
    transition-delay: 0.4s;
  }

  .logo .circle3 {
    width: 110px;
    transform: translate3d(0, 0, 60px);
    top: 17px;
    right: 17px;
    transition-delay: 0.8s;
  }

  .logo .circle4 {
    width: 80px;
    transform: translate3d(0, 0, 80px);
    top: 23px;
    right: 23px;
    transition-delay: 1.2s;
  }

  .logo .circle5 {
    width: 50px;
    transform: translate3d(0, 0, 100px);
    top: 30px;
    right: 30px;
    display: grid;
    place-content: center;
    transition-delay: 1.6s;
  }

  .logo .circle5 .svg {
    color: #fafafa;
  }

  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 30deg);
    box-shadow: 0 16px 48px 0 rgba(56, 142, 60, 0.3);
  }

  .parent:hover .card .bottom .social-buttons-container .social-button {
    transform: translate3d(0, 0, 50px);
    box-shadow: 0 8px 24px 0 rgba(56, 142, 60, 0.2);
  }

  .parent:hover .card .logo .circle2 {
    transform: translate3d(0, 0, 60px);
  }

  .parent:hover .card .logo .circle3 {
    transform: translate3d(0, 0, 80px);
  }

  .parent:hover .card .logo .circle4 {
    transform: translate3d(0, 0, 100px);
  }

  .parent:hover .card .logo .circle5 {
    transform: translate3d(0, 0, 120px);
  }

  @media (max-width: 1024px) {
    .parent {
      width: 280px;
      height: 290px;
    }

    .content {
      padding: 90px 50px 0px 25px;
    }

    .content .title {
      font-size: 16px;
    }

    .content .text {
      font-size: 12px;
    }
  }
`;

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-[#388E3C]/20 p-2 md:rounded-3xl md:p-3 bg-black/50 backdrop-blur-sm">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 shadow-[0px_0px_27px_0px_rgba(56,142,60,0.1)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-[#388E3C]/30 p-2 bg-[#388E3C]/10">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-[#FAFAFA] md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-[#FAFAFA]/80 md:text-base/[1.375rem] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-[#388E3C]/20",
        (index === 0 || index === 4) && "lg:border-l border-[#388E3C]/20",
        index < 4 && "lg:border-b border-[#388E3C]/20"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-[#388E3C]/5 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-[#388E3C]/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-[#388E3C] group-hover/feature:text-[#4CAF50] transition-colors duration-200">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[#388E3C]/30 group-hover/feature:bg-[#388E3C] transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-[#FAFAFA] font-sf-pro-bold">
          {title}
        </span>
      </div>
      <p className="text-sm text-[#FAFAFA]/70 max-w-xs relative z-10 px-10 font-sf-pro-regular">
        {description}
      </p>
    </div>
  );
};

export default Features;
