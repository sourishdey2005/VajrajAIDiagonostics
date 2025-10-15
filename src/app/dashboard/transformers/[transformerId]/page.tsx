

"use client"

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Zap, MapPin, Shield, Gauge, Calendar, User, Factory, Hash, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Transformer } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { FaultProgressionChart } from './components/fault-progression-chart'
import { LiveAnalysisChart } from './components/live-analysis-chart'
import { CommunicationLog } from './components/communication-log'
import { Skeleton } from '@/components/ui/skeleton'

export default function TransformerDetailPage() {
  const params = useParams()
  const transformerId = params.transformerId as string;
  const [transformer, setTransformer] = useState<Transformer | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransformer = async () => {
        if (!transformerId) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('transformers')
            .select('*')
            .eq('id', transformerId)
            .single();

        if (error || !data) {
            console.error("Error fetching transformer:", error);
            setTransformer(null);
        } else {
            setTransformer(data as Transformer);
        }
        setIsLoading(false);
    };

    fetchTransformer();
  }, [transformerId]);

  if (isLoading) {
      return (
        <div className="flex flex-col gap-8">
             <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <div>
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-80 mt-2" />
                </div>
             </div>
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-96 w-full" />
             <div className="grid md:grid-cols-5 gap-8">
                <Skeleton className="h-96 md:col-span-3" />
                <Skeleton className="h-96 md:col-span-2" />
             </div>
        </div>
      )
  }

  if (!transformer) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-bold">Transformer Not Found</h2>
            <p className="text-muted-foreground">The transformer with ID <span className="font-mono">{transformerId}</span> could not be found.</p>
            <Button asChild className="mt-4">
                <Link href="/dashboard/transformers">Return to Fleet</Link>
            </Button>
        </div>
    )
  }

  const detailItems = [
    { icon: Hash, label: 'Transformer ID', value: transformer.id },
    { icon: MapPin, label: 'Location', value: transformer.location },
    { icon: Factory, label: 'Manufacturer', value: transformer.manufacturer },
    { icon: Gauge, label: 'Average Load', value: `${transformer.load}%` },
    { icon: Calendar, label: 'Last Inspection', value: format(parseISO(transformer.last_inspection), 'dd MMM yyyy') },
    { icon: Calendar, label: 'Next Service Due', value: format(parseISO(transformer.nextServiceDate), 'dd MMM yyyy') },
    { icon: User, label: 'Last Serviced By', value: transformer.servicedBy },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/transformers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to transformers list</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            {transformer.name}
          </h1>
          <p className="text-muted-foreground">Detailed view for transformer <span className="font-semibold text-primary">{transformer.id}</span></p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Transformer Details</CardTitle>
              <CardDescription>Comprehensive overview of the asset's current status and properties.</CardDescription>
            </div>
            <div className="flex gap-2">
               <Badge
                  variant={
                    transformer.status === "Operational"
                      ? "secondary"
                      : transformer.status === "Needs Attention"
                      ? "destructive"
                      : "outline"
                  }
                  className={cn(
                    "font-semibold text-base py-1 px-3",
                    transformer.status === "Operational" && "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
                    transformer.status === "Needs Attention" && "bg-destructive/10 text-destructive border-destructive/20",
                    transformer.status === "Under Maintenance" && "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    )}
                >
                  <Zap className="w-4 h-4 mr-2"/>
                  {transformer.status}
                </Badge>
                <Badge
                  variant={
                    transformer.criticality === "High"
                      ? "destructive"
                      : transformer.criticality === "Medium"
                      ? "default"
                      : "secondary"
                  }
                    className={cn(
                    "font-semibold text-base py-1 px-3",
                    transformer.criticality === "High" && "bg-destructive/10 text-destructive border-destructive/20",
                    transformer.criticality === "Medium" && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
                    transformer.criticality === "Low" && "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  )}
                >
                  <Shield className="w-4 h-4 mr-2"/>
                  {transformer.criticality} Criticality
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {detailItems.map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                        <div className="text-muted-foreground pt-1">
                            <item.icon className="w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                            <p className="text-base font-semibold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
      
      <CommunicationLog transformerId={transformer.id} />

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <FaultProgressionChart />
        </div>
        <div className="md:col-span-2">
          <LiveAnalysisChart isFaulty={transformer.status === 'Needs Attention'} />
        </div>
      </div>

    </div>
  )
}
