import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Container,
  Activity,
  HardDrive,
  Network,
} from "lucide-react";
import { ContainerData } from "../App";

interface ContainerTableProps {
  data: ContainerData[];
  sortConfig: { key: keyof ContainerData; direction: "asc" | "desc" } | null;
  onSort: (
    config: { key: keyof ContainerData; direction: "asc" | "desc" } | null,
  ) => void;
}

export function ContainerTable({
  data,
  sortConfig,
  onSort,
}: ContainerTableProps) {
  const handleSort = (key: keyof ContainerData) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    onSort({ key, direction });
  };

  const getSortIcon = (key: keyof ContainerData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getStatusBadge = (status: ContainerData["status"]) => {
    const variants = {
      running: "default",
      stopped: "secondary",
      paused: "outline",
      restarting: "destructive",
    } as const;

    const colors = {
      running: "bg-green-100 text-green-800 border-green-200",
      stopped: "bg-gray-100 text-gray-800 border-gray-200",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
      restarting: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const formatMemory = (memory: number) => {
    if (memory >= 1024) {
      return `${(memory / 1024).toFixed(1)} GB`;
    }
    return `${memory} MB`;
  };

  const formatCreated = (created: string) => {
    try {
      return new Date(created).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return created;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Container className="h-5 w-5" />
          Container Overview
        </CardTitle>
        <CardDescription>
          {data.length} containers • Click column headers to sort
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("image")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Image
                    {getSortIcon("image")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("status")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead>Ports</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("created")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Created
                    {getSortIcon("created")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("uptime")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Uptime
                    {getSortIcon("uptime")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("cpu")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    CPU %{getSortIcon("cpu")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("memory")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <HardDrive className="h-4 w-4 mr-1" />
                    Memory
                    {getSortIcon("memory")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("network")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <Network className="h-4 w-4 mr-1" />
                    Network
                    {getSortIcon("network")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No containers found matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((container) => (
                  <TableRow key={container.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{container.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {container.id.substring(0, 12)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{container.image}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(container.status)}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {container.ports || (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatCreated(container.created)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{container.uptime}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">
                        {container.cpu > 0 ? `${container.cpu}%` : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">
                        {container.memory > 0
                          ? formatMemory(container.memory)
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{container.network}</div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
