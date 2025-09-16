import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Container, Activity, HardDrive, Network, Clock } from "lucide-react";
import { PortData } from "../App";

interface DashboardStatsProps {
  ports: PortData[];
}

export function DashboardStats({ ports }: DashboardStatsProps) {
  const listeningPorts = ports.filter((p) => p.state === "LISTENING").length;
  const totalPorts = ports.length;
  const listeningPercentage =
    totalPorts > 0 ? (listeningPorts / totalPorts) * 100 : 0;

  const uniqueProcesses = new Set(ports.map((p) => p.process)).size;
  const containerPorts = ports.filter((p) => p.dockerContainer !== "").length;
  const hostPorts = ports.filter((p) => p.dockerContainer === "").length;

  const protocolCounts = ports.reduce(
    (acc, port) => {
      acc[port.protocol] = (acc[port.protocol] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stateCounts = ports.reduce(
    (acc, port) => {
      acc[port.state] = (acc[port.state] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueContainers = new Set(
    ports.filter((p) => p.dockerContainer !== "").map((p) => p.dockerContainer),
  ).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ports</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPorts}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Listening: {listeningPorts}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Other: {totalPorts - listeningPorts}
            </div>
          </div>
          <Progress value={listeningPercentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Processes
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueProcesses}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Unique processes listening on ports
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <div>TCP: {protocolCounts.TCP || 0}</div>
            <div>UDP: {protocolCounts.UDP || 0}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Docker Containers
          </CardTitle>
          <Container className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueContainers}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Active containers with exposed ports
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <div>Container ports: {containerPorts}</div>
            <div>Host ports: {hostPorts}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Connection States
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Object.keys(stateCounts).length}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Different connection states
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(stateCounts)
              .slice(0, 3)
              .map(([state, count]) => (
                <div key={state} className="text-xs bg-muted px-2 py-1 rounded">
                  {state}: {count}
                </div>
              ))}
            {Object.keys(stateCounts).length > 3 && (
              <div className="text-xs bg-muted px-2 py-1 rounded">
                +{Object.keys(stateCounts).length - 3} more
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
