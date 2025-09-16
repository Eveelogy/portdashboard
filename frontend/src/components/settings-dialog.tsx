import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Settings, Palette, Sun, Moon, Monitor, Pipette } from "lucide-react";
import { useTheme } from "./theme-provider";

interface SettingsDialogProps {
  persistFilters: boolean;
  onPersistFiltersChange: (persist: boolean) => void;
}

export function SettingsDialog({
  persistFilters,
  onPersistFiltersChange,
}: SettingsDialogProps) {
  const {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    customColor,
    setCustomColor,
  } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const colorSchemes = [
    { value: "default", label: "Default", color: "bg-slate-500" },
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
    {
      value: "custom",
      label: "Custom",
      color: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
    },
  ];

  const handleCustomColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newColor = event.target.value;
    setCustomColor(newColor);
    if (colorScheme !== "custom") {
      setColorScheme("custom");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard preferences and appearance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Mode */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Theme Mode
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <Button
                        key={themeOption.value}
                        variant={
                          theme === themeOption.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setTheme(themeOption.value as any)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {themeOption.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Color Scheme */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Color Scheme
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {colorSchemes.map((scheme) => (
                    <Button
                      key={scheme.value}
                      variant={
                        colorScheme === scheme.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setColorScheme(scheme.value as any)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <div className={`h-4 w-4 rounded-full ${scheme.color}`} />
                      {scheme.label}
                    </Button>
                  ))}
                </div>

                {/* Custom Color Picker */}
                {colorScheme === "custom" && (
                  <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                    <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Pipette className="h-4 w-4" />
                      Custom Color
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Input
                          type="color"
                          value={customColor}
                          onChange={handleCustomColorChange}
                          className="w-12 h-10 p-1 border rounded cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={customColor}
                          onChange={handleCustomColorChange}
                          placeholder="#2563eb"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        Pick a color or enter a hex value to customize your
                        theme
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border shadow-sm"
                          style={{ backgroundColor: customColor }}
                        />
                        <span className="text-xs text-muted-foreground">
                          Preview
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure how your data and filters behave
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="persist-filters">Persist Filters</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your filter settings when refreshing or reopening the
                    dashboard
                  </p>
                </div>
                <Switch
                  id="persist-filters"
                  checked={persistFilters}
                  onCheckedChange={onPersistFiltersChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
