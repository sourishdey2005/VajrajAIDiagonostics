
"use client"

import * as React from "react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { HealthStatus, Zone, MaintenanceStatus, getHealthStatus, getMaintenanceStatus } from "../page"
import { Transformer } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MapControlsProps {
  filters: {
    health: HealthStatus;
    zone: Zone;
    maintenance: MaintenanceStatus;
  };
  onFilterChange: React.Dispatch<React.SetStateAction<MapControlsProps['filters']>>;
  allTransformers: Transformer[];
}

const healthStatusColors: Record<Exclude<HealthStatus, 'All'>, string> = {
  'Healthy': 'hsl(var(--chart-2))',
  'Warning': 'hsl(var(--chart-3))',
  'Critical': 'hsl(var(--destructive))',
};

const zoneColors: Record<Exclude<Zone, 'All'>, string> = {
    'North': 'hsl(var(--chart-1))',
    'South': 'hsl(var(--chart-2))',
    'East': 'hsl(var(--chart-3))',
    'West': 'hsl(var(--chart-4))',
}

const maintenanceStatusColors: Record<Exclude<MaintenanceStatus, 'All'>, string> = {
    'OK': 'hsl(var(--chart-2))',
    'Due Soon': 'hsl(var(--chart-3))',
    'Overdue': 'hsl(var(--destructive))',
}

export function MapControls({ filters, onFilterChange, allTransformers }: MapControlsProps) {
    
    const handleFilter = <K extends keyof MapControlsProps['filters']>(key: K, value: MapControlsProps['filters'][K]) => {
        onFilterChange(prev => ({...prev, [key]: prev[key] === value ? 'All' : value }))
    }

    const healthStatusData = React.useMemo(() => {
        const counts = allTransformers.reduce((acc, t) => {
            const status = getHealthStatus(t.status);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<Exclude<HealthStatus, 'All'>, number>);

        return (Object.keys(healthStatusColors) as Exclude<HealthStatus, 'All'>[]).map(status => ({
            name: status,
            value: counts[status] || 0,
            fill: healthStatusColors[status],
        }));
    }, [allTransformers]);

    const zoneData = React.useMemo(() => {
        const counts = allTransformers.reduce((acc, t) => {
            acc[t.zone] = (acc[t.zone] || 0) + 1;
            return acc;
        }, {} as Record<Exclude<Zone, 'All'>, number>);

        return (Object.keys(zoneColors) as Exclude<Zone, 'All'>[]).map(zone => ({
            name: zone,
            value: counts[zone] || 0,
            fill: zoneColors[zone],
        }));
    }, [allTransformers]);

    const maintenanceData = React.useMemo(() => {
         const counts = allTransformers.reduce((acc, t) => {
            const status = getMaintenanceStatus(t.nextServiceDate);
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<Exclude<MaintenanceStatus, 'All'>, number>);

        return (Object.keys(maintenanceStatusColors) as Exclude<MaintenanceStatus, 'All'>[]).map(status => ({
            name: status,
            value: counts[status] || 0,
            fill: maintenanceStatusColors[status],
        }));
    }, [allTransformers]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Map Filters</CardTitle>
        <CardDescription>Click on chart segments to filter assets on the map.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
            <h4 className="text-sm font-medium mb-2">Health Status</h4>
             <ChartContainer config={{}} className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                         <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={healthStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            labelLine={false}
                            label={({ name, value }) => value > 0 ? `${name.charAt(0)}: ${value}` : ''}
                            onClick={(_, index) => handleFilter('health', healthStatusData[index].name as HealthStatus)}
                        >
                            {healthStatusData.map((entry) => (
                                <Cell 
                                    key={`cell-${entry.name}`}
                                    fill={entry.fill}
                                    className={cn(
                                        "cursor-pointer outline-none transition-opacity",
                                        filters.health === 'All' || filters.health === entry.name ? "opacity-100" : "opacity-30 hover:opacity-60"
                                    )}
                                    stroke={filters.health === entry.name ? 'hsl(var(--foreground))' : 'hsl(var(--border))'}
                                    strokeWidth={filters.health === entry.name ? 2 : 1}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
        <div>
            <h4 className="text-sm font-medium mb-2">Grid Zone</h4>
             <ChartContainer config={{}} className="h-[150px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneData} layout="vertical" margin={{ left: 50 }}>
                        <XAxis type="number" hide domain={[0, 'dataMax + 2']}/>
                        <YAxis type="category" dataKey="name" width={50} tickLine={false} axisLine={false}/>
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="value" radius={4}>
                            {zoneData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.name}`}
                                    fill={entry.fill}
                                    className={cn(
                                        "cursor-pointer outline-none transition-opacity",
                                        filters.zone === 'All' || filters.zone === entry.name ? "opacity-100" : "opacity-30 hover:opacity-60"
                                    )}
                                    onClick={() => handleFilter('zone', entry.name as Zone)}
                                    stroke={filters.zone === entry.name ? 'hsl(var(--foreground))' : 'none'}
                                    strokeWidth={2}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
        <div>
            <h4 className="text-sm font-medium mb-2">Maintenance Status</h4>
            <div className="flex gap-2">
                {(Object.keys(maintenanceStatusColors) as Exclude<MaintenanceStatus, 'All'>[]).map(status => {
                    const count = maintenanceData.find(d => d.name === status)?.value || 0;
                    const isSelected = filters.maintenance === status;
                    const isAnySelected = filters.maintenance !== 'All';
                    
                    return (
                         <button
                            key={status}
                            onClick={() => handleFilter('maintenance', status)}
                            className={cn(
                                "flex-1 p-2 rounded-lg text-left transition-all border-2",
                                isSelected 
                                    ? "border-primary bg-primary/20"
                                    : `border-transparent bg-muted/50 hover:bg-muted`,
                                !isAnySelected || isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                            )}
                        >
                           <p className="font-bold text-lg">{count}</p>
                           <p className="text-xs font-medium" style={{color: maintenanceStatusColors[status]}}>{status}</p>
                        </button>
                    )
                })}
            </div>
        </div>

        {(filters.health !== 'All' || filters.zone !== 'All' || filters.maintenance !== 'All') && (
            <Button variant="ghost" onClick={() => onFilterChange({health: 'All', zone: 'All', maintenance: 'All'})}>
                Clear All Filters
            </Button>
        )}
      </CardContent>
    </Card>
  )
}
