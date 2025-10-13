"use client"

import { useState, useEffect } from "react"
import { MapView } from "./components/map-view"
import { transformers as initialTransformers } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Transformer = typeof initialTransformers[0];

export default function MapViewPage() {
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

  if (!isClient) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Geo-AI Fault Map
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            Real-time asset health and predictive risk zones on a live map.
          </p>
        </div>
        <div className="h-[600px] w-full animate-pulse rounded-md bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Geo-AI Fault Map
          </h1>
          <p className="text-muted-foreground max-w-[700px]">
            Real-time asset health and predictive risk zones on a live map.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Fleet Distribution & Predictive Risk</CardTitle>
            <CardDescription>Hover over transformers for details. Red zones indicate AI-predicted areas of higher fault probability.</CardDescription>
        </CardHeader>
        <CardContent>
            <MapView transformers={transformers} />
        </CardContent>
      </Card>
    </div>
  )
}
