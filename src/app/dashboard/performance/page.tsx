
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
import { Trophy, ClipboardCheck, Timer, Award, Zap, PlusCircle, MoreHorizontal, Trash2, Loader2 } from 'lucide-react';
import { EngineerPerformance, engineerPerformanceData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AddEngineerDialog } from './components/add-engineer-dialog';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';


export default function PerformancePage() {
    const { role } = useUserRole();
    const router = useRouter();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);
    const [engineerData, setEngineerData] = useState<EngineerPerformance[]>([]);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    useEffect(() => {
        if(role === 'manager') {
            setIsLoading(true);
            setTimeout(() => {
                setEngineerData(engineerPerformanceData);
                setIsLoading(false);
            }, 1000);
        }
    }, [role]);

    const topPerformers = useMemo(() => {
        if (engineerData.length === 0) return { faults: null, reports: null, onTime: null, resolution: null };
        const faults = [...engineerData].sort((a, b) => b.faultsDetected - a.faultsDetected)[0];
        const reports = [...engineerData].sort((a, b) => b.reportsSubmitted - a.reportsSubmitted)[0];
        const onTime = [...engineerData].sort((a, b) => b.onTimeCompletion - a.onTimeCompletion)[0];
        const resolution = [...engineerData].sort((a, b) => a.avgResolutionHours - b.avgResolutionHours)[0];
        return { faults, reports, onTime, resolution };
    }, [engineerData]);
    
    const chartData = useMemo(() => {
        return engineerData.map((e, i) => ({
            name: e.name,
            value: e.onTimeCompletion,
            fill: `hsl(var(--chart-${(i%5)+1}))`
        })).sort((a, b) => b.value - a.value);
    }, [engineerData]);

    const handleAddEngineer = (data: Omit<EngineerPerformance, 'engineerId' | 'avatar'>) => {
        // Simulate adding engineer
        const newEngineer = {
            ...data,
            engineerId: `E-${String(engineerData.length + 1).padStart(3, '0')}`,
            avatar: 'user-avatar-placeholder',
        };
        setEngineerData(prev => [...prev, newEngineer]);
        toast({ title: "Engineer Added", description: `${data.name} has been added to the team.` });
    };

    const handleRemoveEngineer = (engineerId: string) => {
        setEngineerData(prev => prev.filter(e => e.engineerId !== engineerId));
        toast({ title: "Engineer Removed", description: `The engineer has been removed from the team.`, variant: "destructive" });
    }

    if (!isClient || role !== 'manager') {
        return null;
    }

    if (isLoading) {
        return (
             <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">Engineer Performance</h1>
                        <p className="text-muted-foreground">Track and compare key performance indicators for your field engineering team.</p>
                    </div>
                     <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Engineer</Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <Skeleton className="h-12 w-full" />
                             <Skeleton className="h-12 w-full" />
                             <div className="flex items-center justify-center pt-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="ml-4 text-muted-foreground">Fetching performance data...</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Skeleton className="h-96" />
                </div>
             </div>
        )
    }

    return (
        <>
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                        Engineer Performance
                    </h1>
                    <p className="text-muted-foreground">
                        Track and compare key performance indicators for your field engineering team.
                    </p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add Engineer
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400"><Trophy /> Top Fault Detector</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.faults?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.faults?.faultsDetected || 0} faults identified</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"><ClipboardCheck /> Most Reports Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.reports?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.reports?.reportsSubmitted || 0} reports submitted</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"><Timer /> Highest On-Time Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.onTime?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.onTime?.onTimeCompletion || 0}% completion</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400"><Zap /> Fastest Resolution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topPerformers.resolution?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{topPerformers.resolution?.avgResolutionHours || 0} hours avg. time</p>
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
                                    <TableHead className="w-px"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {engineerData.map(engineer => {
                                    const avatar = PlaceHolderImages.find(p => p.id === engineer.avatar);
                                    return (
                                        <TableRow key={engineer.engineerId}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {avatar ? <AvatarImage src={avatar.imageUrl} alt={engineer.name} data-ai-hint={avatar.imageHint} /> : <AvatarImage src="https://picsum.photos/seed/placeholder/100/100" alt={engineer.name} data-ai-hint="person face"/> }
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
                                            <TableCell>
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                    <Trash2 className="mr-2"/> Remove Engineer
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently remove {engineer.name} from the performance dashboard. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRemoveEngineer(engineer.engineerId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Remove
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
        <AddEngineerDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setAddDialogOpen}
            onAddEngineer={handleAddEngineer}
        />
        </>
    );
}
