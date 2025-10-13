'use client';

import { useState, useTransition, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DollarSign, LineChart, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { estimateMaintenanceCosts } from '@/ai/flows/estimate-maintenance-costs';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const faultTypes = [
  'Winding Deformation',
  'Axial Displacement',
  'Core Fault',
  'Bushing Fault',
  'Inter-turn Short',
];

const criticalityLevels = ['Low', 'Medium', 'High'];

type EstimationResult = {
  estimatedRepairCost: number;
  preventativeMaintenanceCost: number;
  potentialSavings: number;
  costBreakdown: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetingPage() {
  const [selectedFault, setSelectedFault] = useState<string>(faultTypes[0]);
  const [selectedCriticality, setSelectedCriticality] = useState<string>(criticalityLevels[1]);
  const [estimation, setEstimation] = useState<EstimationResult | null>(null);
  const [isEstimating, startTransition] = useTransition();
  const { toast } = useToast();

  const handleEstimate = () => {
    startTransition(async () => {
      try {
        setEstimation(null);
        const result = await estimateMaintenanceCosts({
          faultClassification: selectedFault,
          criticality: selectedCriticality,
        });
        setEstimation(result);
      } catch (error) {
        console.error('Failed to get estimation', error);
        toast({
          title: 'Estimation Failed',
          description: 'Could not retrieve cost estimates from the AI. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const chartData = useMemo(() => {
    if (!estimation) return [];
    return [
      {
        name: 'Cost Comparison',
        'Reactive Repair': estimation.estimatedRepairCost,
        'Preventative Action': estimation.preventativeMaintenanceCost,
      },
    ];
  }, [estimation]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Project Budgeting Estimator
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Use our AI-powered tool to estimate maintenance costs and see the value of early fault detection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Estimation Setup</CardTitle>
          <CardDescription>Select a fault scenario and transformer criticality to generate a cost analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="fault-type">Fault Type</Label>
            <Select value={selectedFault} onValueChange={setSelectedFault}>
              <SelectTrigger id="fault-type">
                <SelectValue placeholder="Select a fault type" />
              </SelectTrigger>
              <SelectContent>
                {faultTypes.map(fault => (
                  <SelectItem key={fault} value={fault}>
                    {fault}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criticality">Asset Criticality</Label>
            <Select value={selectedCriticality} onValueChange={setSelectedCriticality}>
              <SelectTrigger id="criticality">
                <SelectValue placeholder="Select criticality" />
              </SelectTrigger>
              <SelectContent>
                {criticalityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleEstimate} disabled={isEstimating} className="w-full md:w-auto">
              {isEstimating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEstimating ? 'Estimating...' : 'Estimate Costs'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEstimating && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="md:col-span-3">
                <Skeleton className="h-96 w-full" />
            </div>
         </div>
      )}

      {estimation && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <TrendingDown /> Reactive Repair Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-800 dark:text-red-300">{formatCurrency(estimation.estimatedRepairCost)}</p>
              <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">Cost if fault leads to failure.</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <TrendingUp /> Preventative Action Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-800 dark:text-green-300">
                {formatCurrency(estimation.preventativeMaintenanceCost)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400/80 mt-1">Cost with early detection.</p>
            </CardContent>
          </Card>
           <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <DollarSign /> Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-800 dark:text-blue-300">{formatCurrency(estimation.potentialSavings)}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400/80 mt-1">Value of proactive maintenance.</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><LineChart /> Cost Comparison</CardTitle>
                <CardDescription>{estimation.costBreakdown}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                            <XAxis type="number" tickFormatter={(value) => formatCurrency(value as number)} />
                            <YAxis type="category" dataKey="name" hide />
                             <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                            />
                            <Legend />
                            <Bar dataKey="Reactive Repair" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={30} />
                            <Bar dataKey="Preventative Action" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
