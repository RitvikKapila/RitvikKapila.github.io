"use client"

import { useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "./Icons"

export default function ThemeToggleFixed() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-muted hover:bg-muted/80 border border-border shadow-lg transition-all duration-200 hover:scale-105"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon className="w-5 h-5 text-foreground" /> : <Sun className="w-5 h-5 text-foreground" />}
    </button>
  )
}
