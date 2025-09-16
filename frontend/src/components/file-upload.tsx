import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, FileText } from "lucide-react";
import { PortData } from "../App";

interface FileUploadProps {
  onDataLoad: (data: PortData[]) => void;
}

export function FileUpload({ onDataLoad }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const parsedData = parseCSV(csv);
      onDataLoad(parsedData);
    };
    reader.readAsText(file);
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

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={triggerFileUpload} variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Expected CSV format: Protocol, State, Local Address, Port, PID,
          Process, Docker Container
        </AlertDescription>
      </Alert>
    </div>
  );
}
