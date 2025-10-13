
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Trophy, ClipboardCheck, Timer, Award, Zap } from 'lucide-react';
import { engineerPerformanceData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';

export default function PerformancePage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    const topPerformers = useMemo(() => {
        const faults = [...engineerPerformanceData].sort((a, b) => b.faultsDetected - a.faultsDetected)[0];
        const reports = [...engineerPerformanceData].sort((a, b) => b.reportsSubmitted - a.reportsSubmitted)[0];
        const onTime = [...engineerPerformanceData].sort((a, b) => b.onTimeCompletion - a.onTimeCompletion)[0];
        const resolution = [...engineerPerformanceData].sort((a, b) => a.avgResolutionHours - b.avgResolutionHours)[0];
        return { faults, reports, onTime, resolution };
    }, []);
    
    const chartData = useMemo(() => {
        return engineerPerformanceData.map((e, i) => ({
            name: e.name,
            value: e.onTimeCompletion,
            fill: `hsl(var(--chart-${(i%5)+1}))`
        })).sort((a, b) => b.value - a.value);
    }, []);

    if (!isClient || role !== 'manager') {
        return null; // or a loading spinner
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Engineer Performance
                </h1>
                <p className="text-muted-foreground">
                    Track and compare key performance indicators for your field engineering team.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400"><Trophy /> Top Fault Detector</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.faults.name}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.faults.faultsDetected} faults identified</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"><ClipboardCheck /> Most Reports Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.reports.name}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.reports.reportsSubmitted} reports submitted</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"><Timer /> Highest On-Time Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.onTime.name}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.onTime.onTimeCompletion}% completion</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400"><Zap /> Fastest Resolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.resolution.name}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.resolution.avgResolutionHours} hours avg. time</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Performance Leaderboard</CardTitle>
                        <CardDescription>Detailed comparison of all field service engineers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Engineer</TableHead>
                                    <TableHead className="text-center">Faults Detected</TableHead>
                                    <TableHead className="text-center">Reports Submitted</TableHead>
                                    <TableHead className="text-center">Avg. Resolution (Hrs)</TableHead>
                                    <TableHead className="w-[200px]">On-Time Completion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {engineerPerformanceData.map(engineer => {
                                    const avatar = PlaceHolderImages.find(p => p.id === engineer.avatar);
                                    return (
                                        <TableRow key={engineer.engineerId}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {avatar && <AvatarImage src={avatar.imageUrl} alt={engineer.name} data-ai-hint={avatar.imageHint} />}
                                                        <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{engineer.name}</p>
                                                        <p className="text-xs text-muted-foreground">{engineer.engineerId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold text-lg">{engineer.faultsDetected}</TableCell>
                                            <TableCell className="text-center font-semibold text-lg">{engineer.reportsSubmitted}</TableCell>
                                            <TableCell className="text-center font-semibold text-lg">{engineer.avgResolutionHours}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={engineer.onTimeCompletion} className="h-2" indicatorClassName={
                                                        engineer.onTimeCompletion > 95 ? 'bg-green-500' : engineer.onTimeCompletion > 90 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }/>
                                                    <span className="font-semibold text-muted-foreground">{engineer.onTimeCompletion}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award /> On-Time Completion Rate</CardTitle>
                        <CardDescription>Percentage of maintenance tasks completed by the due date.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={{}} className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" domain={[0, 100]} hide/>
                                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{fontSize: 12}} width={80} />
                                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                                    <Bar dataKey="value" radius={[0,4,4,0]}>
                                        {chartData.map(entry => <Cell key={entry.name}/>)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
