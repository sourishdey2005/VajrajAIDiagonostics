
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { environmentalData } from '@/lib/data';
import { CloudLightning, Thermometer, AlertCircle, Sun } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EnvironmentalPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('All');

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    const regions = ['All', ...Array.from(new Set(environmentalData.map(d => d.region)))];

    const filteredData = useMemo(() => {
        if (selectedRegion === 'All') return environmentalData;
        return environmentalData.filter(d => d.region === selectedRegion);
    }, [selectedRegion]);
    
    const chartConfig = {
        faults: {
            label: "Faults",
            color: "hsl(var(--destructive))",
        },
        lightningStrikes: {
            label: "Lightning",
            color: "hsl(var(--chart-3))",
        },
        heatwaveDays: {
            label: "Heatwave",
            color: "hsl(var(--chart-5))",
        }
    }

    if (!isClient || role !== 'manager') {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                        Environmental Correlation
                    </h1>
                    <p className="text-muted-foreground">
                        Analyze the correlation between environmental factors and transformer faults.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Faults vs. Environmental Events</CardTitle>
                    <CardDescription>
                       This chart overlays reported faults with environmental data like lightning strikes and heatwave days to identify potential external drivers for failures. Select a region to focus the analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map(region => (
                                    <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <ChartContainer config={chartConfig} className="h-[400px] w-full">
                        <ComposedChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" label={{ value: 'Faults', angle: -90, position: 'insideRight' }}/>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="lightningStrikes" name="Lightning Strikes" fill="var(--color-lightningStrikes)" barSize={20} />
                            <Bar yAxisId="left" dataKey="heatwaveDays" name="Heatwave Days" fill="var(--color-heatwaveDays)" barSize={20} />
                            <Line yAxisId="right" type="monotone" dataKey="faults" name="Reported Faults" stroke="var(--color-faults)" strokeWidth={3} />
                        </ComposedChart>
                    </ChartContainer>
                </CardContent>
            </Card>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CloudLightning /> Lightning Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">12%</p>
                        <p className="text-muted-foreground">of faults in the last quarter occurred within 48 hours of a major lightning storm.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sun /> Heatwave Correlation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">8%</p>
                        <p className="text-muted-foreground">increase in "Needs Attention" alerts during periods of sustained high temperatures.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertCircle /> Regional Vulnerability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">South Zone</p>
                        <p className="text-muted-foreground">shows the highest correlation between environmental events and fault rates.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
