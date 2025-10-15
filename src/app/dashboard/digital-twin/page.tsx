
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/user-role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transformer, transformers as allTransformers, healthHistory, simulationData } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Thermometer, Zap, Gauge, HeartPulse, Activity } from 'lucide-react';
import { DigitalTwinModel } from './components/digital-twin-model';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function HistoricalDataChart({ transformerId }: { transformerId: string }) {
    const data = healthHistory.filter(h => h.transformer_id === transformerId);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity /> Historical Health Score</CardTitle>
                <CardDescription>Health score trend over the last 12 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short' })} />
                            <YAxis domain={[80, 100]} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="health_score" name="Health Score" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function PerformanceSimulation({ transformerId }: { transformerId: string }) {
    const [load, setLoad] = useState(75);
    const [simulationResult, setSimulationResult] = useState(simulationData[0]);

    const handleSimulate = () => {
        // In a real app, this would be an API call to a simulation model
        const result = simulationData.find(s => s.load_scenario === `${load}% Load`);
        if (result) {
            setSimulationResult(result);
        }
    };
    
    const chartData = [
        { name: 'Projected Health', value: simulationResult.projected_health_score, fill: 'hsl(var(--chart-2))' },
        { name: 'Current Health', value: healthHistory.find(h => h.transformer_id === transformerId)?.health_score || 95, fill: 'hsl(var(--chart-1))'},
    ];


    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Simulation</CardTitle>
                <CardDescription>Simulate future performance under different load conditions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="load-slider" className="text-sm font-medium">Simulated Load: {load}%</label>
                        <Slider
                            id="load-slider"
                            min={50}
                            max={120}
                            step={5}
                            value={[load]}
                            onValueChange={(val) => setLoad(val[0])}
                            className="mt-2"
                        />
                    </div>
                    <Button onClick={handleSimulate}>Run Simulation</Button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Projected Outcomes (1-Year)</h4>
                        <p className="text-sm text-muted-foreground">{simulationResult.recommendation}</p>
                         <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Projected Lifespan Reduction:</span>
                                <span className="font-bold text-destructive">{simulationResult.lifespan_reduction_percent}%</span>
                            </div>
                         </div>
                    </div>
                    <ChartContainer config={{}} className="h-[150px] w-full">
                         <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                               <XAxis type="number" domain={[0, 100]} hide />
                               <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                               <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                               <Bar dataKey="value" radius={4}>
                                   {chartData.map((entry) => <Cell key={entry.name} />)}
                               </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default function DigitalTwinPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTransformerId, setSelectedTransformerId] = useState<string>('TR-001');
    const [transformers, setTransformers] = useState<Transformer[]>([]);

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    useEffect(() => {
        if (role === 'manager') {
            setIsLoading(true);
            setTimeout(() => {
                setTransformers(allTransformers);
                setIsLoading(false);
            }, 500);
        }
    }, [role]);

    const selectedTransformer = useMemo(() => {
        return transformers.find(t => t.id === selectedTransformerId);
    }, [selectedTransformerId, transformers]);

    if (!isClient || role !== 'manager') {
        return null;
    }
    
    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                        Digital Twin Command Center
                    </h1>
                    <p className="text-muted-foreground max-w-[700px]">
                        Interact with virtual replicas of your assets for advanced diagnostics and simulation.
                    </p>
                </div>
                <Select value={selectedTransformerId} onValueChange={setSelectedTransformerId}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a transformer..." />
                    </SelectTrigger>
                    <SelectContent>
                        {transformers.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.id} - {t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedTransformer ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Digital Twin Status</CardTitle>
                            <CardDescription>Real-time mirrored parameters of {selectedTransformer.id}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <DigitalTwinModel status={selectedTransformer.status} />
                            <div className="mt-6 space-y-4 text-sm">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="flex items-center gap-2 text-muted-foreground"><HeartPulse /> Health Score</span>
                                    <span className="font-bold text-lg text-green-500">{healthHistory.find(h => h.transformer_id === selectedTransformer.id)?.health_score || 'N/A'}%</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Thermometer /> Temperature</span>
                                    <span className="font-bold">78°C</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Zap /> Voltage</span>
                                    <span className="font-bold">229V</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-muted-foreground"><Gauge /> Load</span>
                                    <span className="font-bold">{selectedTransformer.load}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-8">
                        <PerformanceSimulation transformerId={selectedTransformer.id} />
                        <HistoricalDataChart transformerId={selectedTransformer.id} />
                    </div>
                </div>
            ) : (
                <p>Select a transformer to view its digital twin.</p>
            )}

        </div>
    );
}
