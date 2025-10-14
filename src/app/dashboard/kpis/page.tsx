
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { kpiData, Kpi } from '@/lib/data';
import { TrendingUp, TrendingDown, Target, Settings, Check, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


const kpiIcons: Record<string, React.ReactNode> = {
    'Fault Reduction YoY': <TrendingDown />,
    'Downtime Saved (hrs)': <Clock />,
    'MTTR (Mean Time to Repair)': <TrendingUp />,
    'Proactive Maintenance Rate': <Check />
}

const kpiColors = [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
]

function KpiCard({ kpi, color }: { kpi: Kpi, color: string }) {
    const isPositive = kpi.changeDirection === 'up';
    return (
        <Card>
            <CardHeader>
                <CardTitle className={cn("flex items-center gap-2 text-sm", color)}>
                   {kpiIcons[kpi.name] || <Target />} {kpi.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{kpi.value}{kpi.unit}</p>
                <div className={cn("flex items-center text-sm font-semibold mt-1", isPositive ? "text-green-600" : "text-red-600")}>
                    {isPositive ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                    {kpi.change}% vs. last period
                </div>
            </CardContent>
        </Card>
    );
}

export default function KpiDashboardPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [visibleKpis, setVisibleKpis] = useState<Record<string, boolean>>({
        'Fault Reduction YoY': true,
        'Downtime Saved (hrs)': true,
        'MTTR (Mean Time to Repair)': true,
        'Proactive Maintenance Rate': false,
    });

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    const handleToggleKpi = (kpiName: string) => {
        setVisibleKpis(prev => ({ ...prev, [kpiName]: !prev[kpiName] }));
    };

    const displayedKpis = useMemo(() => {
        return kpiData.filter(kpi => visibleKpis[kpi.name]);
    }, [visibleKpis]);

    if (!isClient || role !== 'manager') {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Customizable KPIs
                </h1>
                <p className="text-muted-foreground">
                    Track the performance indicators that matter most to your team.
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedKpis.map((kpi, index) => (
                        <KpiCard key={kpi.name} kpi={kpi} color={kpiColors[index % kpiColors.length]}/>
                    ))}
                    {displayedKpis.length === 0 && (
                        <div className="md:col-span-2 flex items-center justify-center h-48 bg-muted rounded-lg">
                            <p className="text-muted-foreground">Select a KPI to display from the settings panel.</p>
                        </div>
                    )}
                </div>

                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings /> Display Settings</CardTitle>
                        <CardDescription>Choose which KPIs to show on your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {kpiData.map(kpi => (
                             <div key={kpi.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <Label htmlFor={`switch-${kpi.name.replace(/\s/g, '-')}`} className="font-medium">{kpi.name}</Label>
                                <Switch
                                    id={`switch-${kpi.name.replace(/\s/g, '-')}`}
                                    checked={visibleKpis[kpi.name]}
                                    onCheckedChange={() => handleToggleKpi(kpi.name)}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>KPI Trends</CardTitle>
                    <CardDescription>Visualizing the performance of MTTR over the last year.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer>
                             <LineChart data={kpiData[2].trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}/>
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" strokeWidth={2} name="MTTR (Hours)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
