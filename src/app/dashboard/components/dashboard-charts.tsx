"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { analysisTrendData, faultDistributionData } from "@/lib/data"
import { cn } from "@/lib/utils"

type ChartData = {
  name: string;
  value: number;
  fill: string;
}[];

interface DynamicChartProps {
  data: ChartData;
  className?: string;
}

const chartConfig = {
  analyses: {
    label: "Analyses",
    color: "hsl(var(--chart-1))",
  },
  alerts: {
    label: "Alerts",
    color: "hsl(var(--chart-2))",
  },
}

export function FaultDistributionChart({ className }: { className?: string}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Fault Distribution</CardTitle>
        <CardDescription>Breakdown of simulated fault types detected in the last quarter.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={faultDistributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                 {faultDistributionData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function AnalysisTrendChart({ className }: { className?: string}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Analysis & Alert Trend (Simulated)</CardTitle>
        <CardDescription>Monthly trend of data analyses performed and critical alerts generated.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysisTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="Analyses" stroke="var(--color-analyses)" strokeWidth={2} name="Analyses" />
              <Line type="monotone" dataKey="Alerts" stroke="var(--color-alerts)" strokeWidth={2} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function TransformerStatusChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Transformer Status</CardTitle>
        <CardDescription>Live distribution of transformer operational statuses across the fleet.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function CriticalityDistributionChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Criticality Distribution</CardTitle>
        <CardDescription>Breakdown of asset criticality levels across the monitored fleet.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ManufacturerDistributionChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Manufacturer Distribution</CardTitle>
        <CardDescription>Breakdown of transformer assets by manufacturer.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name} (${entry.value})`}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LocationDistributionChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Asset Geo-distribution</CardTitle>
        <CardDescription>Number of transformers monitored in each location.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" name="Transformers" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function UpcomingServiceChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Upcoming Maintenance</CardTitle>
        <CardDescription>Transformers scheduled for service in the upcoming months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" name="Services Due" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function LoadDistributionChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Load Distribution</CardTitle>
        <CardDescription>Distribution of average operational load across the fleet.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ServiceEngineerWorkloadChart({ data, className }: DynamicChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Engineer Workload</CardTitle>
        <CardDescription>Number of transformers assigned to each service engineer.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }}/>
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Assigned" radius={[0, 4, 4, 0]}>
                 {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    