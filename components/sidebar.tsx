"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Clock,
  FileText,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  Stethoscope,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  }, [pathname, isMobile]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Navigation items with healthcare-specific icons
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/patient", label: "Patient", icon: User },
    { href: "/dashboard/doctor", label: "Doctor", icon: Stethoscope },
    { href: "/dashboard/admin", label: "Admin", icon: Shield },
  ];

  // Sidebar variants for animation
  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.2 } },
    closed: { width: "72px", transition: { duration: 0.2 } },
  };

  // Mobile sidebar variants
  const mobileSidebarVariants = {
    open: { x: 0, transition: { duration: 0.2 } },
    closed: { x: "-100%", transition: { duration: 0.2 } },
  };

  // Render mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-[#388E3C]/10 border-[#388E3C]/30 text-[#FAFAFA] hover:bg-[#388E3C]/20"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <AnimatePresence>
          {showMobileSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={toggleSidebar}
              />

              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileSidebarVariants}
                className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-black/95 backdrop-blur-lg border-r border-[#388E3C]/20"
              >
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#388E3C] to-[#4CAF50] flex items-center justify-center">
                        <Image
                          src="/logomain.png" 
                          width={24}
                          height={24}
                          alt="DAVA Logo"
                        />
                      </div>
                      <h1 className="text-xl font-sf-pro-bold text-[#FAFAFA]">
                        DAVA
                      </h1>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className="text-[#FAFAFA] hover:bg-[#388E3C]/10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#388E3C]/10 transition-all duration-200 font-sf-pro-regular",
                          pathname === item.href &&
                            "bg-[#388E3C]/20 text-[#388E3C] border border-[#388E3C]/30"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Render desktop sidebar
  return (
    <motion.div
      initial={sidebarOpen ? "open" : "closed"}
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="h-screen bg-black/95 backdrop-blur-lg border-r border-[#388E3C]/20 relative z-20 overflow-hidden"
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen ? (
            <Link className="flex items-center gap-2" href="/">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/logomain.png"
                  width={24}
                  height={24}
                  alt="DAVA Logo"
                />
              </div>
              <h1 className="text-xl font-sf-pro-bold text-[#FAFAFA]">DAVA</h1>
            </Link>
          ) : (
            <Link className="flex justify-center" href="/">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <Image
                  src="/logomain.png"
                  width={24}
                  height={24}
                  alt="DAVA Logo"
                />
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-[#FAFAFA] hover:bg-[#388E3C]/10"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-[#FAFAFA]/70 hover:text-[#FAFAFA] hover:bg-[#388E3C]/10 transition-all duration-200 font-sf-pro-regular",
                pathname === item.href &&
                  "bg-[#388E3C]/20 text-[#388E3C] border border-[#388E3C]/30",
                !sidebarOpen && "justify-center"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
