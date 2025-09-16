import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Moon, Sun, Palette, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeSelector() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const colorSchemes = [
    { value: "default", label: "Default", color: "bg-primary" },
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium">Theme</div>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value as any)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              {themeOption.label}
              {theme === themeOption.value && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-sm font-medium">Color Scheme</div>
        {colorSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value)}
            className="cursor-pointer"
          >
            <div className={`mr-2 h-4 w-4 rounded-full ${scheme.color}`} />
            {scheme.label}
            {colorScheme === scheme.value && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
