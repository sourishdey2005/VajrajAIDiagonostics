
"use client"

import { useState, useEffect } from "react"
import { MapView } from "./components/map-view"
import { transformers as initialTransformers, Transformer } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapControls } from "./components/map-controls"
import { addMonths, isBefore, isAfter } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export type HealthStatus = 'All' | 'Healthy' | 'Warning' | 'Critical';
export type Zone = 'All' | 'North' | 'South' | 'East' | 'West';
export type MaintenanceStatus = 'All' | 'Overdue' | 'Due Soon' | 'OK';

export const getHealthStatus = (status: Transformer['status']): Exclude<HealthStatus, 'All'> => {
  if (status === 'Needs Attention') return 'Critical';
  if (status === 'Under Maintenance') return 'Warning';
  return 'Healthy';
}

export const getMaintenanceStatus = (nextServiceDate: string): Exclude<MaintenanceStatus, 'All'> => {
  const now = new Date();
  const serviceDate = new Date(nextServiceDate);
  const twoMonthsFromNow = addMonths(now, 2);

  if (isBefore(serviceDate, now)) return 'Overdue';
  if (isAfter(serviceDate, now) && isBefore(serviceDate, twoMonthsFromNow)) return 'Due Soon';
  return 'OK';
};

export default function MapViewPage() {
  const [allTransformers, setAllTransformers] = useState<Transformer[]>(initialTransformers);
  const [filteredTransformers, setFilteredTransformers] = useState<Transformer[]>(initialTransformers);
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState({
    health: 'All' as HealthStatus,
    zone: 'All' as Zone,
    maintenance: 'All' as MaintenanceStatus,
  });

  useEffect(() => {
    setIsClient(true)
    try {
      const storedTransformers = localStorage.getItem("transformers");
      if (storedTransformers) {
        const parsed = JSON.parse(storedTransformers);
        setAllTransformers(parsed);
      }
    } catch (error) {
      console.error("Could not load transformers from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let transformersToFilter = allTransformers;

    if (filters.health !== 'All') {
      transformersToFilter = transformersToFilter.filter(t => getHealthStatus(t.status) === filters.health);
    }

    if (filters.zone !== 'All') {
      transformersToFilter = transformersToFilter.filter(t => t.zone === filters.zone);
    }

    if (filters.maintenance !== 'All') {
      transformersToFilter = transformersToFilter.filter(t => getMaintenanceStatus(t.nextServiceDate) === filters.maintenance);
    }

    setFilteredTransformers(transformersToFilter);

  }, [filters, allTransformers, isClient]);

  if (!isClient) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            India Grid Map
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            Real-time asset health, predictive risk zones, and powerful filtering.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
             <Card>
              <CardHeader>
                <CardTitle>Fleet Distribution & Predictive Risk</CardTitle>
                <CardDescription>Hover over transformers for details. Red zones indicate AI-predicted areas of higher fault probability.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[600px] w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Skeleton className="h-[200px] w-full" />
             <Skeleton className="h-[250px] w-full" />
             <Skeleton className="h-[150px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            India Grid Map
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            Real-time asset health, predictive risk zones, and powerful filtering.
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle>Fleet Distribution & Predictive Risk</CardTitle>
                    <CardDescription>Hover over transformers for details. Red zones indicate AI-predicted areas of higher fault probability.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MapView transformers={filteredTransformers} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <MapControls 
                filters={filters} 
                onFilterChange={setFilters} 
                allTransformers={allTransformers}
            />
        </div>
      </div>
    </div>
  )
}
