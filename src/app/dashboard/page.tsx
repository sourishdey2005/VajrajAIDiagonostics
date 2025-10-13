"use client"

import { useState, useEffect, useMemo } from "react"
import { Activity, AlertTriangle, BadgePercent, CircuitBoard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { transformers as initialTransformers } from "@/lib/data"
import { 
  AnalysisTrendChart, 
  CriticalityDistributionChart, 
  FaultDistributionChart, 
  LoadDistributionChart,
  LocationDistributionChart,
  ManufacturerDistributionChart, 
  ServiceEngineerWorkloadChart,
  TransformerStatusChart,
  UpcomingServiceChart,
} from "./components/dashboard-charts"

type Transformer = typeof initialTransformers[0];

// Helper to generate chart colors
const generateChartColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(var(--chart-${(i % 5) + 1}))`);
  }
  return colors;
};

export default function DashboardPage() {
  const [transformers, setTransformers] = useState<Transformer[]>(initialTransformers);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const storedTransformers = localStorage.getItem("transformers");
      if (storedTransformers) {
        setTransformers(JSON.parse(storedTransformers));
      }
    } catch (error) {
      console.error("Could not load transformers from localStorage", error);
    }
  }, []);

  const dashboardStats = useMemo(() => {
    const operational = transformers.filter(t => t.status === 'Operational').length;
    const health = transformers.length > 0 ? Math.round((operational / transformers.length) * 100) : 100;
    const alerts = transformers.filter(t => t.status === 'Needs Attention').length;
    return {
      monitored: transformers.length,
      alerts: alerts,
      health: health
    }
  }, [transformers]);

  const transformerStatusData = useMemo(() => {
    const statuses = transformers.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusColors: Record<string, string> = {
      'Operational': 'hsl(var(--chart-2))',
      'Needs Attention': 'hsl(var(--destructive))',
      'Under Maintenance': 'hsl(var(--chart-3))'
    }

    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value,
      fill: statusColors[name] || 'hsl(var(--chart-5))'
    }));
  }, [transformers]);

  const criticalityDistributionData = useMemo(() => {
    const criticalities = transformers.reduce((acc, t) => {
      acc[t.criticality] = (acc[t.criticality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const criticalityColors: Record<string, string> = {
      'High': 'hsl(var(--destructive))',
      'Medium': 'hsl(var(--chart-3))',
      'Low': 'hsl(var(--chart-1))'
    }

    return Object.entries(criticalities).map(([name, value]) => ({
      name,
      value,
      fill: criticalityColors[name] || 'hsl(var(--chart-5))'
    }));
  }, [transformers]);
  
  const manufacturerDistributionData = useMemo(() => {
     const manufacturers = transformers.reduce((acc, t) => {
      acc[t.manufacturer] = (acc[t.manufacturer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const colors = generateChartColors(Object.keys(manufacturers).length);

    return Object.entries(manufacturers).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index]
    }));
  }, [transformers]);
  
  const locationDistributionData = useMemo(() => {
    const locations = transformers.reduce((acc, t) => {
      acc[t.location] = (acc[t.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = generateChartColors(Object.keys(locations).length);

    return Object.entries(locations).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index]
    }));
  }, [transformers]);

  const upcomingServiceData = useMemo(() => {
    const services = transformers.reduce((acc, t) => {
      const month = new Date(t.nextServiceDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedServices = Object.entries(services).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
    const colors = generateChartColors(sortedServices.length);

    return sortedServices.map(([name, value], index) => ({
      name,
      value,
      fill: colors[index]
    }));
  }, [transformers]);

  const loadDistributionData = useMemo(() => {
    const loadBins: Record<string, number> = {
      '0-50%': 0,
      '51-70%': 0,
      '71-90%': 0,
      '>90%': 0,
    };

    transformers.forEach(t => {
      if (t.load <= 50) loadBins['0-50%']++;
      else if (t.load <= 70) loadBins['51-70%']++;
      else if (t.load <= 90) loadBins['71-90%']++;
      else loadBins['>90%']++;
    });

    const colors = generateChartColors(Object.keys(loadBins).length);
    return Object.entries(loadBins).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index]
    }));
  }, [transformers]);
  
  const serviceEngineerWorkloadData = useMemo(() => {
    const engineers = transformers.reduce((acc, t) => {
      acc[t.servicedBy] = (acc[t.servicedBy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = generateChartColors(Object.keys(engineers).length);
    return Object.entries(engineers).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index]
    })).sort((a,b) => b.value - a.value);
  }, [transformers]);


  if (!isClient) {
    return (
       <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Fleet Command Center
            </h1>
            <p className="text-muted-foreground max-w-[700px]">
              Here's a real-time overview of your transformer fleet's health and performance.
            </p>
          </div>
           <div className="h-96 w-full animate-pulse rounded-md bg-muted"></div>
           <div className="h-96 w-full animate-pulse rounded-md bg-muted"></div>
           <div className="h-96 w-full animate-pulse rounded-md bg-muted"></div>
       </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Fleet Command Center
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Here's a real-time overview of your transformer fleet's health and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transformers Monitored
            </CardTitle>
            <CircuitBoard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.monitored}</div>
            <p className="text-xs text-muted-foreground">
              Across all assigned substations
            </p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5 text-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.alerts}</div>
            <p className="text-xs text-destructive/80">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.health}%</div>
            <p className="text-xs text-muted-foreground">
              Overall fleet operational status
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Diagnostic Accuracy
            </CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">
              AI model performance on historical data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <FaultDistributionChart className="lg:col-span-3" />
        <TransformerStatusChart data={transformerStatusData} className="lg:col-span-2" />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
          <CriticalityDistributionChart data={criticalityDistributionData} className="lg:col-span-2" />
          <AnalysisTrendChart className="lg:col-span-3" />
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <ManufacturerDistributionChart data={manufacturerDistributionData} />
        <LocationDistributionChart data={locationDistributionData} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <UpcomingServiceChart data={upcomingServiceData} className="lg:col-span-2" />
        <LoadDistributionChart data={loadDistributionData}/>
      </div>
       <div className="grid gap-4 md:gap-8">
        <ServiceEngineerWorkloadChart data={serviceEngineerWorkloadData} />
      </div>
    </div>
  )
}

    