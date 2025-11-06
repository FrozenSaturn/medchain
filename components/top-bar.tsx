"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  User,
  Settings,
  X,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TopBar() {
  const [date, setDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date: Monday, January 1, 2023
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time: 12:00 PM
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-16 border-b border-[#388E3C]/20 bg-black/95 backdrop-blur-lg flex items-center justify-between px-4 md:px-6 z-40"
    >
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <p className="text-sm text-[#FAFAFA]/60 font-sf-pro-regular">
            {formattedDate}
          </p>
          <p className="text-lg font-sf-pro-semibold text-[#FAFAFA]">
            {formattedTime}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <ConnectButton
            label="Sign in"
            chainStatus="icon"
            showBalance={false}
          />
        </div>

        <div className="relative" ref={notificationsRef}>
          <Button
            variant="outline"
            size="icon"
            className="relative border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 transition-all duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-[#388E3C]/30 text-[#FAFAFA] bg-[#388E3C]/10 hover:bg-[#388E3C]/20 hover:border-[#388E3C]/50 transition-all duration-200"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-black/95 border-[#388E3C]/20 backdrop-blur-lg"
          >
            <DropdownMenuLabel className="text-[#FAFAFA] font-sf-pro-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#388E3C]/20" />
            <DropdownMenuItem
              asChild
              className="text-[#FAFAFA] hover:bg-[#388E3C]/10 focus:bg-[#388E3C]/10"
            >
              <Link href="/account">
                <User className="mr-2 h-4 w-4 text-[#388E3C]" />
                <span className="font-sf-pro-regular">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="text-[#FAFAFA] hover:bg-[#388E3C]/10 focus:bg-[#388E3C]/10"
            >
              <Link href="/account">
                <Settings className="mr-2 h-4 w-4 text-[#388E3C]" />
                <span className="font-sf-pro-regular">Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#388E3C]/20" />
            <DropdownMenuItem className="text-[#FAFAFA] hover:bg-[#388E3C]/10 focus:bg-[#388E3C]/10">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
