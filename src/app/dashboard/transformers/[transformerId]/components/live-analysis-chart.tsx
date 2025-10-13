
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Thermometer, Zap, Gauge } from 'lucide-react';

const MAX_DATA_POINTS = 20;

const generateInitialData = (isFaulty: boolean) => {
  return Array.from({ length: MAX_DATA_POINTS }, (_, i) => {
    const baseTemp = isFaulty ? 85 : 70;
    const baseVoltage = isFaulty ? 225 : 230;
    const baseLoad = isFaulty ? 92 : 75;
    return {
      time: Date.now() - (MAX_DATA_POINTS - i) * 2000,
      temperature: baseTemp + Math.random() * (isFaulty ? 10 : 3),
      voltage: baseVoltage + Math.random() * (isFaulty ? 8 : 2) - (isFaulty ? 4 : 1),
      load: baseLoad + Math.random() * (isFaulty ? 5 : 2),
    };
  });
};

const getStatusColor = (value: number, normal: number, warning: number, critical: number) => {
  if (value >= critical) return 'text-red-500';
  if (value >= warning) return 'text-yellow-500';
  return 'text-green-500';
};

export function LiveAnalysisChart({ isFaulty }: { isFaulty: boolean }) {
  const [data, setData] = useState(() => generateInitialData(isFaulty));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = {
          time: Date.now(),
          temperature: (isFaulty ? 85 : 70) + Math.random() * (isFaulty ? 12 : 4),
          voltage: (isFaulty ? 225 : 230) + Math.random() * (isFaulty ? 10 : 3) - (isFaulty ? 5 : 1.5),
          load: (isFaulty ? 92 : 75) + Math.random() * (isFaulty ? 6 : 3),
        };
        const updatedData = [...prevData.slice(1), newDataPoint];
        return updatedData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isFaulty]);

  const latestData = data[data.length - 1];

  const chartConfig = useMemo(() => ({
    temperature: { label: "Temperature", color: "hsl(var(--chart-3))" },
    voltage: { label: "Voltage", color: "hsl(var(--chart-1))" },
    load: { label: "Load", color: "hsl(var(--chart-5))" },
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live IoT Sensor Feed</CardTitle>
        <CardDescription>Simulated real-time operational parameters.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="flex flex-col items-center">
                <Thermometer className={cn("w-6 h-6 mb-1", getStatusColor(latestData.temperature, 75, 85, 95))} />
                <p className="text-sm text-muted-foreground">Temp.</p>
                <p className="font-bold text-lg">{latestData.temperature.toFixed(1)}°C</p>
            </div>
            <div className="flex flex-col items-center">
                <Zap className={cn("w-6 h-6 mb-1", getStatusColor(Math.abs(latestData.voltage - 230), 5, 10, 15))} />
                <p className="text-sm text-muted-foreground">Voltage</p>
                <p className="font-bold text-lg">{latestData.voltage.toFixed(1)}V</p>
            </div>
            <div className="flex flex-col items-center">
                <Gauge className={cn("w-6 h-6 mb-1", getStatusColor(latestData.load, 80, 90, 95))} />
                <p className="text-sm text-muted-foreground">Load</p>
                <p className="font-bold text-lg">{latestData.load.toFixed(1)}%</p>
            </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                type="number"
                domain={['dataMin', 'dataMax']}
                tickCount={5}
                />
              <YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} hide />
              <YAxis yAxisId="right" orientation="right" domain={['dataMin - 5', 'dataMax + 5']} hide/>

              <Tooltip content={<ChartTooltipContent 
                formatter={(value, name) => {
                  const config = chartConfig[name as keyof typeof chartConfig];
                  return (
                    <div className="flex min-w-[120px] items-center">
                        <div className="flex flex-1 items-center gap-2">
                           <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: config.color }}
                            />
                           <span className="text-muted-foreground">{config.label}</span>
                        </div>
                        <span className="font-bold">{value.toFixed(1)}</span>
                    </div>
                  );
                }}
              />} />

              <defs>
                 <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.temperature.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartConfig.temperature.color} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.voltage.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartConfig.voltage.color} stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.load.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartConfig.load.color} stopOpacity={0}/>
                </linearGradient>
              </defs>

              <Area type="monotone" dataKey="temperature" yAxisId="left" stroke={chartConfig.temperature.color} fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="voltage" yAxisId="right" stroke={chartConfig.voltage.color} fillOpacity={1} fill="url(#colorVoltage)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="load" yAxisId="left" stroke={chartConfig.load.color} fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} dot={false} />

            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: chartConfig.temperature.color}}></span> Temperature
            <span className="inline-block w-2 h-2 rounded-full mr-1 ml-3" style={{backgroundColor: chartConfig.voltage.color}}></span> Voltage
            <span className="inline-block w-2 h-2 rounded-full mr-1 ml-3" style={{backgroundColor: chartConfig.load.color}}></span> Load
        </p>
      </CardContent>
    </Card>
  )
}
