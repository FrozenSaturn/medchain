"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
// import { AIFloatingButton } from "./assistant/ai-floating-button"
// import { useStore } from "@/lib/store"
import { initializeStoreWithMockData } from "@/lib/mock-data"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // const { courses, tasks, sidebarOpen } = useStore()

  // Initialize store with mock data if empty
  // useEffect(() => {
  //   if (courses.length === 0 && tasks.length === 0) {
  //     initializeStoreWithMockData(useStore.getState())
  //   }
  // }, [courses.length, tasks.length])

  // Determine if we're on the dashboard page
  const isDashboard = pathname === "/"

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />

        <main className={`flex-1 overflow-auto p-4 md:p-6 ${isDashboard ? "overflow-hidden" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
