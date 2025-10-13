
"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Calendar, Zap, Gauge, AlertTriangle, Shield, TrendingUp, History, ChevronDown } from "lucide-react"
import { transformers, healthHistory, faultHistory, type Transformer } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, parseISO, differenceInDays } from "date-fns"
import { useUserRole } from "@/contexts/user-role-context"
import { useRouter } from "next/navigation"


const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

function HealthTrendChart({ selectedIds }: { selectedIds: string[] }) {
    const chartData = useMemo(() => {
        if (selectedIds.length === 0) return [];

        const filteredHistory = healthHistory.filter(h => selectedIds.includes(h.transformerId));
        
        // Group by date
        const dataByDate = filteredHistory.reduce((acc, curr) => {
            if (!acc[curr.date]) {
                acc[curr.date] = { date: format(parseISO(curr.date), "MMM yyyy") };
            }
            acc[curr.date][curr.transformerId] = curr.healthScore;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(dataByDate).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [selectedIds]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp /> Health Score Trend</CardTitle>
                <CardDescription>Comparison of transformer health scores over the past year.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    {selectedIds.length > 0 ? (
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[60, 100]} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                        <p className="text-sm text-muted-foreground col-span-2 font-bold">{label}</p>
                                                        {payload.map((p, i) => (
                                                            <div key={p.dataKey} className="flex items-center gap-2">
                                                                <div style={{ background: chartColors[i % chartColors.length] }} className="w-3 h-3 rounded-full" />
                                                                <p className="text-sm text-muted-foreground">{p.dataKey}:</p>
                                                                <p className="text-sm font-medium">{p.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Legend />
                                {selectedIds.map((id, index) => (
                                    <Line
                                        key={id}
                                        type="monotone"
                                        dataKey={id}
                                        stroke={chartColors[index % chartColors.length]}
                                        strokeWidth={2}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select at least one transformer to see health trends.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function FaultHistory({ selectedIds }: { selectedIds: string[] }) {
    const filteredHistory = useMemo(() => {
        return faultHistory
            .filter(f => selectedIds.includes(f.transformerId))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedIds]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> Fault History</CardTitle>
                <CardDescription>Recent fault events for the selected transformers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((fault, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <p className="font-bold">{format(parseISO(fault.date), "dd")}</p>
                                    <p className="text-xs text-muted-foreground">{format(parseISO(fault.date), "MMM")}</p>
                                </div>
                                <div className="flex-1 p-3 bg-muted/50 rounded-lg border">
                                    <p className="font-semibold text-primary">{fault.transformerId}</p>
                                    <p>{fault.faultType} - <span className={fault.severity === 'High' ? 'text-destructive font-bold' : fault.severity === 'Medium' ? 'text-yellow-500 font-semibold' : ''}>{fault.severity} Severity</span></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-[100px] text-muted-foreground">
                            No fault history for selected transformers.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function KeyStats({ selectedIds }: { selectedIds: string[] }) {
    const selectedTransformers = useMemo(() => {
        return transformers.filter(t => selectedIds.includes(t.id));
    }, [selectedIds]);

    if (selectedIds.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><CardContent className="pt-6 h-32 flex items-center justify-center text-muted-foreground">Select an asset</CardContent></Card>
                <Card><CardContent className="pt-6 h-32 flex items-center justify-center text-muted-foreground">Select an asset</CardContent></Card>
                <Card><CardContent className="pt-6 h-32 flex items-center justify-center text-muted-foreground">Select an asset</CardContent></Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"><Calendar /> Days Since Inspection</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-end">
                    {selectedTransformers.map((t, index) => (
                        <div key={t.id} className="text-center">
                            <p className="text-3xl font-bold" style={{color: chartColors[selectedIds.indexOf(t.id) % chartColors.length]}}>{differenceInDays(new Date(), parseISO(t.last_inspection))}</p>
                            <p className="text-xs font-semibold text-primary">{t.id}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"><Gauge /> Average Load</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-end">
                    {selectedTransformers.map((t) => (
                         <div key={t.id} className="text-center">
                            <p className="text-3xl font-bold" style={{color: chartColors[selectedIds.indexOf(t.id) % chartColors.length]}}>{t.load}%</p>
                            <p className="text-xs font-semibold text-primary">{t.id}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"><Shield /> Criticality</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-center">
                     {selectedTransformers.map((t) => (
                         <div key={t.id} className="text-center">
                            <p className={`text-xl font-bold ${t.criticality === 'High' ? 'text-destructive' : t.criticality === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{t.criticality}</p>
                             <p className="text-xs font-semibold text-primary">{t.id}</p>
                         </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}


export default function ComparisonPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>(['TR-001', 'TR-002', 'TR-006']);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    const handleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    if (!isClient || role !== 'manager') {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Asset Performance Comparison
                </h1>
                <p className="text-muted-foreground">
                    Select two or more transformers to compare their performance metrics side-by-side.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Transformer Selection</CardTitle>
                    <CardDescription>Choose the assets you wish to compare from the list below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full md:w-[300px] justify-between">
                                <span>{selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select Transformers'}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search transformers..." />
                                <CommandList>
                                    <CommandEmpty>No transformers found.</CommandEmpty>
                                    <CommandGroup>
                                        {transformers.map(t => (
                                            <CommandItem key={t.id} onSelect={() => handleSelect(t.id)}>
                                                <Checkbox
                                                    checked={selectedIds.includes(t.id)}
                                                    className="mr-2"
                                                />
                                                <span>{t.id} - {t.name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedIds.map(id => (
                            <div key={id} className="flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm">
                                <span>{id}</span>
                                <button onClick={() => handleSelect(id)} className="rounded-full hover:bg-muted-foreground/20">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <KeyStats selectedIds={selectedIds} />

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <HealthTrendChart selectedIds={selectedIds} />
                <FaultHistory selectedIds={selectedIds} />
            </div>
        </div>
    )
}
