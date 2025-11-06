"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { CardSpotlight } from "../../components/ui/card-spotlight";
import { World } from "../../components/ui/globe";

// Import Lucide icons
import {
  Stethoscope,
  Brain,
  Shield,
  Database,
  Github,
  ArrowRight,
  Heart,
  Users,
  Code2,
  Palette,
} from "lucide-react";

const contributionAreas = [
  {
    title: "Healthcare Integration",
    description:
      "Help integrate medical systems, EHR compatibility, and healthcare protocols to ensure seamless patient care.",
    skills: [
      "HL7 FHIR",
      "HIPAA Compliance",
      "Medical APIs",
      "Healthcare Standards",
    ],
    icon: Stethoscope,
    color: "#388E3C",
  },
  {
    title: "AI & Machine Learning",
    description:
      "Contribute to our AI-powered diagnosis assistance, symptom analysis, and predictive healthcare algorithms.",
    skills: ["Python", "TensorFlow", "Medical NLP", "Predictive Analytics"],
    icon: Brain,
    color: "#4CAF50",
  },
  {
    title: "Security & Privacy",
    description:
      "Ensure patient data protection, implement robust security measures, and maintain HIPAA compliance standards.",
    skills: ["Encryption", "HIPAA", "Security Audits", "Privacy Protocols"],
    icon: Shield,
    color: "#81C784",
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Contribute = () => {
  return (
    <section
      id="contribute"
      className="py-24 bg-black relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#388E3C]/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4CAF50]/10 rounded-full filter blur-3xl animate-pulse [animation-delay:'2s']"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#388E3C]/20 border border-[#388E3C]/30 mb-6">
            <Code2 className="w-4 h-4 text-[#388E3C] mr-2" />
            <span className="text-sm font-medium text-[#388E3C] font-sf-pro-medium">
              Open Source Healthcare
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-[#FAFAFA] font-sf-pro-regular">
            Build the Future of{" "}
            <span style={{ color: "#388E3C" }} className="font-sf-pro-bold">
              Healthcare
            </span>
          </h2>
          <p className="text-gray-300/90 max-w-2xl mx-auto text-base md:text-lg">
            Join our mission to revolutionize healthcare through technology.
            Contribute to building a platform that connects patients with
            trusted doctors worldwide.
          </p>
        </motion.div>

        {/* Card Grid for Contributions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {contributionAreas.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants as any}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <CardSpotlight
                  radius={350}
                  color={item.color}
                  className="h-full bg-black/50 border-[#388E3C]/20 hover:border-[#388E3C]/40 transition-all duration-300"
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-[#388E3C]/20 border border-[#388E3C]/30 mr-4">
                        <IconComponent className="h-6 w-6 text-[#388E3C]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#FAFAFA] font-sf-pro-medium">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-300/80 text-sm leading-relaxed mb-6 flex-grow">
                      {item.description}
                    </p>

                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#388E3C]/20">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs py-1 px-2.5 rounded-full bg-[#388E3C]/15 text-[#388E3C] font-medium border border-[#388E3C]/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to action section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-r from-[#388E3C]/10 to-[#4CAF50]/10 border border-[#388E3C]/20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#FAFAFA] font-sf-pro-medium">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-300/80 mb-8 text-lg">
              Join our community of healthcare innovators and help us build a
              platform that truly serves patients and doctors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="https://github.com/FrozenSaturn/Dava"
                target="_blank"
                rel="noopener noreferrer"
                passHref
                legacyBehavior
              >
                <Button
                  asChild
                  className="bg-[#388E3C] hover:bg-[#4CAF50] text-white px-8 py-3 rounded-lg font-semibold group flex items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <a>
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button className="bg-transparent border border-[#388E3C] hover:bg-[#388E3C]/10 text-[#388E3C] hover:text-[#4CAF50] px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Try the Platform
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contribute;
