"use client";

import React from "react";
import { Github, Twitter, Mail, Send, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Timeline", href: "#timeline" },
      { label: "Contribute", href: "#contribute" },
      { label: "Roadmap", href: "#timeline" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API", href: "/developers/api" },
      { label: "Tutorials", href: "/blog/tutorials" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Kaushik2003/V4", icon: Github },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "Contact Us", href: "mailto:contact@dava.app", icon: Mail },
];

const Footer = () => {
  return (
    <motion.footer
      className="bg-black py-16 md:py-20 border-t border-[#388E3C]/20 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background elements matching the theme */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#388E3C]/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#388E3C]/5 rounded-full filter blur-3xl animate-pulse [animation-delay:'2s']"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Column 1: Logo and Description */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" passHref>
              <div className="flex items-center gap-2.5 mb-4 cursor-pointer group w-fit">
                <div className="h-10 w-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logomain.png"
                    width={40}
                    height={40}
                    alt="DAVA Logo"
                    className="p-0.5"
                  />
                </div>
                <span className="text-2xl font-bold text-[#FAFAFA] transition-colors duration-300 group-hover:text-[#388E3C] font-sf-pro-bold">
                  DAVA
                </span>
              </div>
            </Link>
            <p className="text-[#FAFAFA]/70 text-sm leading-relaxed mb-6 max-w-sm font-sf-pro-regular">
              AI-powered healthcare platform. Connect with trusted doctors,
              manage appointments, and access your medical records securely.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={
                    social.label === "GitHub" || social.label === "Twitter"
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    social.label === "GitHub" || social.label === "Twitter"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className="text-[#FAFAFA]/60 hover:text-[#388E3C] p-2 rounded-full hover:bg-[#388E3C]/10 transition-all duration-200 border border-transparent hover:border-[#388E3C]/20"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-sf-pro-semibold text-[#FAFAFA]/90 mb-4 md:mb-5 text-base">
                {section.title}
              </h3>
              <ul className="space-y-2.5 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} passHref>
                      <span className="text-[#FAFAFA]/60 hover:text-[#388E3C] hover:underline underline-offset-4 decoration-[#388E3C]/50 transition-colors duration-200 text-sm cursor-pointer font-sf-pro-regular">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#388E3C]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#FAFAFA]/50 text-xs sm:text-sm order-2 sm:order-1 font-sf-pro-regular">
            © {new Date().getFullYear()} DAVA. All rights reserved. Healthcare
            innovation powered by AI.
          </p>
          <div className="order-1 sm:order-2">
            <Link href="#subscribe" passHref>
              <Button
                variant="ghost"
                className="text-[#388E3C] hover:text-[#388E3C] hover:bg-[#388E3C]/10 text-sm px-3 py-1.5 group border border-[#388E3C]/20 hover:border-[#388E3C]/40 font-sf-pro-regular"
              >
                Join mailing list for updates
                <Send className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
