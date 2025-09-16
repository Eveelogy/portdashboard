import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ColorScheme =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "custom";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");
  const [customColor, setCustomColorState] = useState<string>("#2563eb");

  useEffect(() => {
    // Check for saved theme and color scheme in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;
    const savedCustomColor = localStorage.getItem("customColor");

    if (savedTheme) {
      setThemeState(savedTheme);
    }
    if (savedColorScheme) {
      setColorSchemeState(savedColorScheme);
    }
    if (savedCustomColor) {
      setCustomColorState(savedCustomColor);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark");

    // Determine the actual theme to apply
    let actualTheme = theme;
    if (theme === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(actualTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Apply color scheme to document
    const root = document.documentElement;

    // Remove all color scheme classes
    root.classList.remove(
      "scheme-default",
      "scheme-blue",
      "scheme-green",
      "scheme-purple",
      "scheme-orange",
      "scheme-custom",
    );

    // Add the current color scheme
    root.classList.add(`scheme-${colorScheme}`);
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    // Apply custom color when scheme is custom
    if (colorScheme === "custom") {
      applyCustomColor(customColor);
    }
    localStorage.setItem("customColor", customColor);
  }, [customColor, colorScheme]);

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const applyCustomColor = (color: string) => {
    const root = document.documentElement;
    const [h, s, l] = hexToHsl(color);

    // Generate lighter and darker variants for accent colors
    const lightAccent = `hsl(${h}, ${Math.max(s * 0.3, 10)}%, ${Math.min(l + 40, 95)}%)`;
    const darkAccent = `hsl(${h}, ${Math.max(s * 0.8, 20)}%, ${Math.max(l - 40, 15)}%)`;
    const lightAccentForeground = `hsl(${h}, ${Math.max(s * 0.8, 40)}%, ${Math.max(l - 20, 20)}%)`;
    const darkAccentForeground = `hsl(${h}, ${Math.max(s * 0.6, 30)}%, ${Math.min(l + 20, 80)}%)`;

    // Set CSS custom properties for custom color scheme
    root.style.setProperty("--custom-primary", color);
    root.style.setProperty("--custom-primary-foreground", "#ffffff");
    root.style.setProperty("--custom-accent-light", lightAccent);
    root.style.setProperty(
      "--custom-accent-foreground-light",
      lightAccentForeground,
    );
    root.style.setProperty("--custom-accent-dark", darkAccent);
    root.style.setProperty(
      "--custom-accent-foreground-dark",
      darkAccentForeground,
    );
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  };

  const setCustomColor = (color: string) => {
    setCustomColorState(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        colorScheme,
        setColorScheme,
        customColor,
        setCustomColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
