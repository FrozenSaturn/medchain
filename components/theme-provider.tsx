"use client"

import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render the theme provider after hydration
  // to prevent flickering and incorrect theme on initial load
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      enableColorScheme={true}
      attribute="class"
      defaultTheme="dark"
      storageKey="studysync-theme"
      disableTransitionOnChange
    >
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </NextThemesProvider>
  )
}
