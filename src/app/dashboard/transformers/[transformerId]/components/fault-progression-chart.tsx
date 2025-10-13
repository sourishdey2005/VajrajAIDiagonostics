
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { faultProgressionData } from "@/lib/data"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

// Generate more detailed data for a smoother chart
const generateChartData = (deviation: number) => {
  return Array.from({ length: 100 }, (_, i) => {
    const frequency = (i + 1) * 10; // 10Hz to 1000Hz
    let baseline = 1;
    let current = 1;

    // Introduce deviation in a specific frequency range
    if (frequency > 300 && frequency < 700) {
      const effect = Math.sin((frequency - 300) / 400 * Math.PI); // Smooth peak
      current = 1 - (deviation * effect * 0.1);
    }
    
    // Add some noise
    baseline += (Math.random() - 0.5) * 0.05;
    current += (Math.random() - 0.5) * 0.05;

    return { frequency, baseline, current };
  });
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'Healthy':
      return { className: 'text-green-500', label: 'Healthy' };
    case 'Minor Deviation':
      return { className: 'text-yellow-400', label: 'Minor Deviation' };
    case 'Moderate Deviation':
      return { className: 'text-yellow-600', label: 'Moderate Deviation' };
    case 'Significant Deviation':
      return { className: 'text-orange-500', label: 'Significant Deviation' };
    case 'Critical Fault Detected':
      return { className: 'text-red-600', label: 'Critical Fault Detected' };
    default:
      return { className: 'text-muted-foreground', label: 'Unknown' };
  }
}

export function FaultProgressionChart() {
  const [timeIndex, setTimeIndex] = useState(faultProgressionData.length - 1);
  const activeRecord = faultProgressionData[timeIndex];
  const chartData = generateChartData(activeRecord.deviation);
  const statusInfo = getStatusInfo(activeRecord.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fault Progression Time-Lapse</CardTitle>
        <CardDescription>
          Animated visualization of the transformer's FRA signature evolution over time. Drag the slider to see changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="frequency" type="number" domain={[0, 1000]} tickFormatter={(val) => `${val}Hz`} />
                <YAxis domain={[0.2, 1.2]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="baseline" stroke="hsl(var(--chart-2))" dot={false} strokeWidth={2} name="Baseline"/>
                <Line type="monotone" dataKey="current" stroke="hsl(var(--destructive))" dot={false} strokeWidth={2} name="Current Reading"/>
                <ReferenceLine y={1} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-6">
           <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-lg">
                Date: {format(new Date(activeRecord.date), "dd MMM yyyy")}
            </div>
            <div className={cn("font-bold text-lg", statusInfo.className)}>
                Status: {statusInfo.label}
            </div>
           </div>
          <Slider
            min={0}
            max={faultProgressionData.length - 1}
            step={1}
            value={[timeIndex]}
            onValueChange={(value) => setTimeIndex(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {faultProgressionData.map(d => <span key={d.date}>{format(new Date(d.date), "MMM '’'yy")}</span>)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
