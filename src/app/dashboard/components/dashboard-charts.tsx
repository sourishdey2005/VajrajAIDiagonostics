"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { analysisTrendData, faultDistributionData } from "@/lib/data"
import { cn } from "@/lib/utils"

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
        <CardDescription>Breakdown of fault types detected in the last quarter across the fleet.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={faultDistributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
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
        <CardTitle>Analysis & Alert Trend</CardTitle>
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
              <Line type="monotone" dataKey="Analyses" stroke="var(--color-analyses)" strokeWidth={2} name="Analyses" />
              <Line type="monotone" dataKey="Alerts" stroke="var(--color-alerts)" strokeWidth={2} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
