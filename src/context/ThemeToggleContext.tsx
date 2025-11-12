import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Theme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../theme";

type ThemeMode = "light" | "dark";

interface ThemeToggleContextType {
  themeMode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeToggleContext = createContext<ThemeToggleContextType | undefined>(undefined);

export const useThemeToggle = () => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error("useThemeToggle must be used within a ThemeToggleProvider");
  }
  return context;
};

interface ThemeToggleProviderProps {
  children: ReactNode;
}

export const ThemeToggleProvider: React.FC<ThemeToggleProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("themeMode");
      return (saved === "dark" ? "dark" : "light") as ThemeMode;
    }
    return "light";
  });

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  // Save theme preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("themeMode", themeMode);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return <ThemeToggleContext.Provider value={{ themeMode, theme, toggleTheme }}>{children}</ThemeToggleContext.Provider>;
};
