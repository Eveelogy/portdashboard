import React from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { X, Filter } from "lucide-react";
import { PortData } from "../App";

interface FilterControlsProps {
  filters: {
    protocol: string;
    state: string;
    process: string;
    dockerContainer: string;
    localAddress: string;
  };
  onFiltersChange: (filters: any) => void;
  ports: PortData[];
}

export function FilterControls({
  filters,
  onFiltersChange,
  ports,
}: FilterControlsProps) {
  const uniqueProtocols = Array.from(new Set(ports.map((p) => p.protocol)));
  const uniqueStates = Array.from(new Set(ports.map((p) => p.state)));
  const uniqueProcesses = Array.from(new Set(ports.map((p) => p.process)));
  const uniqueContainers = Array.from(
    new Set(ports.map((p) => p.dockerContainer).filter((c) => c !== "")),
  );

  const handleFilterChange = (key: string, value: string) => {
    // Handle clearing the filter when "all" is selected
    const actualValue = value === "all" ? "" : value;
    onFiltersChange({
      ...filters,
      [key]: actualValue,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      protocol: "",
      state: "",
      process: "",
      dockerContainer: "",
      localAddress: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== "",
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="protocol-filter">Protocol</Label>
          <Select
            value={filters.protocol || "all"}
            onValueChange={(value) => handleFilterChange("protocol", value)}
          >
            <SelectTrigger id="protocol-filter">
              <SelectValue placeholder="All protocols" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All protocols</SelectItem>
              {uniqueProtocols.map((protocol) => (
                <SelectItem key={protocol} value={protocol}>
                  {protocol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state-filter">State</Label>
          <Select
            value={filters.state || "all"}
            onValueChange={(value) => handleFilterChange("state", value)}
          >
            <SelectTrigger id="state-filter">
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              {uniqueStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="process-filter">Process</Label>
          <Input
            id="process-filter"
            placeholder="Filter by process..."
            value={filters.process}
            onChange={(e) => handleFilterChange("process", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="container-filter">Docker Container</Label>
          <Input
            id="container-filter"
            placeholder="Filter by container..."
            value={filters.dockerContainer}
            onChange={(e) =>
              handleFilterChange("dockerContainer", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local-address-filter">Local Address</Label>
          <Input
            id="local-address-filter"
            placeholder="Filter by local address..."
            value={filters.localAddress}
            onChange={(e) => handleFilterChange("localAddress", e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.protocol && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              Protocol: {filters.protocol}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => handleFilterChange("protocol", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.state && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              State: {filters.state}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => handleFilterChange("state", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.process && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              Process: {filters.process}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => handleFilterChange("process", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.dockerContainer && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              Container: {filters.dockerContainer}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => handleFilterChange("dockerContainer", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.localAddress && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
              Local Address: {filters.localAddress}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={() => handleFilterChange("localAddress", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
