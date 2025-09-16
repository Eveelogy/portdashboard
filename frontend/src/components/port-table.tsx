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
  Network,
  Activity,
  Hash,
  Server,
} from "lucide-react";
import { PortData } from "../App";

interface PortTableProps {
  data: PortData[];
  sortConfig: { key: keyof PortData; direction: "asc" | "desc" } | null;
  onSort: (
    config: { key: keyof PortData; direction: "asc" | "desc" } | null,
  ) => void;
}

export function PortTable({ data, sortConfig, onSort }: PortTableProps) {
  const handleSort = (key: keyof PortData) => {
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

  const getSortIcon = (key: keyof PortData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getProtocolBadge = (protocol: string) => {
    const colors = {
      TCP: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
      UDP: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[protocol as keyof typeof colors] ||
          "bg-gray-100 text-gray-800 border-gray-200"
        }
      >
        {protocol}
      </Badge>
    );
  };

  const getStateBadge = (state: string) => {
    const colors = {
      LISTENING:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
      ESTABLISHED:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
      UNCONN:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
      CLOSE_WAIT:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
      TIME_WAIT:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[state as keyof typeof colors] ||
          "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800"
        }
      >
        {state}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Port & Process Overview
        </CardTitle>
        <CardDescription>
          {data.length} ports monitored • Click column headers to sort
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("protocol")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Protocol
                    {getSortIcon("protocol")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("state")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    State
                    {getSortIcon("state")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("localAddress")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    Local Address
                    {getSortIcon("localAddress")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("port")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <Hash className="h-4 w-4 mr-1" />
                    Port
                    {getSortIcon("port")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("pid")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    PID
                    {getSortIcon("pid")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("process")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Process
                    {getSortIcon("process")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("dockerContainer")}
                    className="h-8 p-0 hover:bg-transparent"
                  >
                    <Server className="h-4 w-4 mr-1" />
                    Container
                    {getSortIcon("dockerContainer")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No ports found matching the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((port, index) => (
                  <TableRow
                    key={`${port.localAddress}-${port.port}-${index}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>{getProtocolBadge(port.protocol)}</TableCell>
                    <TableCell>{getStateBadge(port.state)}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {port.localAddress}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm font-medium">
                        {port.port}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{port.pid}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{port.process}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {port.dockerContainer ? (
                          <div className="flex items-center gap-1">
                            <Server className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono">
                              {port.dockerContainer}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Host process
                          </span>
                        )}
                      </div>
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
