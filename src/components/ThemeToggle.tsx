"use client"

import { useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "./Icons"

export default function ThemeToggleFixed() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-muted hover:bg-muted/80 border border-border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5">
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-500 ${
            theme === "light" 
              ? "rotate-0 scale-100 opacity-100" 
              : "rotate-90 scale-0 opacity-0"
          }`} 
        />
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-foreground transition-all duration-500 ${
            theme === "dark" 
              ? "rotate-0 scale-100 opacity-100" 
              : "-rotate-90 scale-0 opacity-0"
          }`} 
        />
      </div>
    </button>
  )
}
