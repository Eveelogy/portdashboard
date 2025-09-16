import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Upload } from "lucide-react";
import { PortData } from "../App";

interface CsvImportButtonProps {
  onDataLoad: (data: PortData[]) => void;
}

export function CsvImportButton({ onDataLoad }: CsvImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const parseCSV = (csv: string): PortData[] => {
    const lines = csv.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    return lines
      .slice(1)
      .map((line, index) => {
        const values = parseCSVLine(line);

        // Map CSV columns to PortData interface
        // Expected columns: Protocol, State, Local Address, Port, PID, Process, Docker Container
        return {
          protocol: values[0] || "TCP",
          state: values[1] || "UNKNOWN",
          localAddress: values[2] || "0.0.0.0",
          port: values[3] || "0",
          pid: values[4] || "0",
          process: values[5] || "unknown",
          dockerContainer: values[6] || "",
        };
      })
      .filter((port) => port.process !== "unknown"); // Filter out invalid rows
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      try {
        const data = parseCSV(csv);
        onDataLoad(data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format and try again.");
      }
    };
    reader.readAsText(file);

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleButtonClick}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Expected format: Protocol, State, Local Address, Port, PID, Process,
            Docker Container
          </p>
        </TooltipContent>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
