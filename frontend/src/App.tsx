import React, { useState, useMemo, useEffect } from "react";
import { CsvImportButton } from "./components/csv-import-button";
import { PortTable } from "./components/port-table";
import { FilterControls } from "./components/filter-controls";
import { SettingsDialog } from "./components/settings-dialog";

import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { Download, RefreshCw, Filter } from "lucide-react";

export interface PortData {
  protocol: string;
  state: string;
  localAddress: string;
  port: string;
  pid: string;
  process: string;
  dockerContainer: string;
}

// Fetch port data from backend API
async function fetchPortData(): Promise<PortData[]> {
  const res = await fetch("/api/ports");
  const data = await res.json();
  // Map backend keys to frontend keys
  return data.map((row: any) => ({
    protocol: row.Protocol || "",
    state: row.State || "",
    localAddress: row["Local Address"] || "",
    port: row.Port || "",
    pid: row.PID || "",
    process: row.Process || "",
    dockerContainer: row["Docker Container"] || "",
  }));
}

interface Filters {
  protocol: string;
  state: string;
  process: string;
  dockerContainer: string;
  localAddress: string;
}

function AppContent() {
  const [ports, setPorts] = useState<PortData[]>([]);
  const [persistFilters, setPersistFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    protocol: "",
    state: "",
    process: "",
    dockerContainer: "",
    localAddress: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PortData;
    direction: "asc" | "desc";
  } | null>(null);

  // Load settings and fetch port data from backend on mount
  useEffect(() => {
    const savedPersistFilters = localStorage.getItem("persistFilters");
    if (savedPersistFilters) {
      setPersistFilters(JSON.parse(savedPersistFilters));
    }

    const savedFilters = localStorage.getItem("dashboardFilters");
    if (
      savedFilters &&
      JSON.parse(localStorage.getItem("persistFilters") || "false")
    ) {
      setFilters(JSON.parse(savedFilters));
    }

    // Fetch port data from backend
    fetchPortData().then(setPorts);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("persistFilters", JSON.stringify(persistFilters));
  }, [persistFilters]);

  // Save filters to localStorage when they change (if persistence is enabled)
  useEffect(() => {
    if (persistFilters) {
      localStorage.setItem("dashboardFilters", JSON.stringify(filters));
    }
  }, [filters, persistFilters]);

  const handlePersistFiltersChange = (persist: boolean) => {
    setPersistFilters(persist);
    if (!persist) {
      // Clear saved filters when persistence is disabled
      localStorage.removeItem("dashboardFilters");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = ports.filter((port) => {
      const matchesProtocol =
        !filters.protocol ||
        port.protocol.toLowerCase().includes(filters.protocol.toLowerCase());
      const matchesState =
        !filters.state ||
        port.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchesProcess =
        !filters.process ||
        port.process.toLowerCase().includes(filters.process.toLowerCase());
      const matchesContainer =
        !filters.dockerContainer ||
        port.dockerContainer
          .toLowerCase()
          .includes(filters.dockerContainer.toLowerCase());
      const matchesLocalAddress =
        !filters.localAddress ||
        port.localAddress
          .toLowerCase()
          .includes(filters.localAddress.toLowerCase());
      return (
        matchesProtocol &&
        matchesState &&
        matchesProcess &&
        matchesContainer &&
        matchesLocalAddress
      );
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [ports, filters, sortConfig]);

  const handleCsvUpload = (data: PortData[]) => {
    setPorts(data);
  };

  const handleExportCsv = () => {
    const csvContent = [
      "Protocol,State,Local Address,Port,PID,Process,Docker Container",
      ...filteredAndSortedData.map(
        (port) =>
          `${port.protocol},${port.state},${port.localAddress},${port.port},${port.pid},${port.process},${port.dockerContainer}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "port-monitor.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    try {
      // First, update the CSV with latest Docker data
      await fetch('/api/update_ports', { method: 'POST' });
      // Then fetch the updated data
      const data = await fetchPortData();
      setPorts(data);
    } catch (error) {
      console.error('Error refreshing ports:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Port & Container Monitor</h1>
            <p className="text-muted-foreground">
              Monitor and track system ports and Docker container mappings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SettingsDialog
              persistFilters={persistFilters}
              onPersistFiltersChange={handlePersistFiltersChange}
            />
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <CsvImportButton onDataLoad={handleCsvUpload} />
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter the port monitoring data by various criteria
              {persistFilters && (
                <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  Auto-saved
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
              ports={ports}
            />
          </CardContent>
        </Card>

        {/* Port Table */}
        <PortTable
          data={filteredAndSortedData}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  );
}
