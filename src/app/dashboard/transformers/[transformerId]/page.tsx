

"use client"

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Zap, MapPin, Shield, Gauge, Calendar, User, Factory, Hash } from 'lucide-react'
import { transformers } from "@/lib/data"
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

export default function TransformerDetailPage() {
  const params = useParams()
  const transformerId = params.transformerId as string;
  const transformer = transformers.find((t) => t.id === transformerId)

  if (!transformer) {
    notFound()
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
          {transformer.id === 'TR-002' ? (
            <FaultProgressionChart />
          ) : (
             <Card>
              <CardHeader>
                  <CardTitle>Fault Progression</CardTitle>
                  <CardDescription>Historical fault analysis data for this asset.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground text-sm text-center py-12">No historical fault progression data available for this transformer.</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="md:col-span-2">
          <LiveAnalysisChart isFaulty={transformer.status === 'Needs Attention'} />
        </div>
      </div>

    </div>
  )
}
