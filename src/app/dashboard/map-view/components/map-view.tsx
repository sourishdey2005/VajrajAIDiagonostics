"use client"

import { cn } from "@/lib/utils"
import { Transformer } from "@/lib/data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MapViewProps {
  transformers: Transformer[]
}

type HealthStatus = 'Healthy' | 'Warning' | 'Critical';

const healthStatusMap: Record<Transformer['status'], HealthStatus> = {
  'Operational': 'Healthy',
  'Under Maintenance': 'Warning',
  'Needs Attention': 'Critical',
};

const healthStatusColors: Record<HealthStatus, string> = {
  'Healthy': 'bg-green-500 border-green-700',
  'Warning': 'bg-yellow-500 border-yellow-700',
  'Critical': 'bg-red-500 border-red-700',
};

const riskZones = [
    { top: '25%', left: '40%', size: '200px' },
    { top: '60%', left: '70%', size: '150px' },
    { top: '40%', left: '15%', size: '120px'},
    { top: '75%', left: '30%', size: '180px'}
]

export function MapView({ transformers }: MapViewProps) {
  return (
    <div className="relative w-full h-[600px] bg-muted/30 rounded-lg overflow-hidden border">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Predictive risk zones */}
      {riskZones.map((zone, index) => (
         <div
            key={index}
            className="absolute rounded-full bg-red-500/10"
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.size,
              height: zone.size,
              transform: 'translate(-50%, -50%)',
            }}
         >
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping"></div>
         </div>
      ))}

      <TooltipProvider>
        {transformers.map((t) => {
          const healthStatus = healthStatusMap[t.status];
          const colorClasses = healthStatusColors[healthStatus] || "bg-gray-500 border-gray-700";
          return (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150 shadow-lg",
                    colorClasses
                  )}
                  style={{
                    top: `${t.latitude}%`,
                    left: `${t.longitude}%`,
                  }}
                >
                  <div className={cn("absolute inset-0 rounded-full animate-ping", colorClasses)} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{t.id} - {t.name}</p>
                <p>Status: <span className={cn(
                    "font-semibold",
                    healthStatus === 'Healthy' && 'text-green-500',
                    healthStatus === 'Critical' && 'text-red-500',
                    healthStatus === 'Warning' && 'text-yellow-500'
                  )}>{healthStatus}</span>
                </p>
                <p>Zone: <span className="font-semibold">{t.zone}</span></p>
                <p>Criticality: <span className={cn(
                    "font-semibold",
                    t.criticality === 'High' && 'text-red-500',
                    t.criticality === 'Medium' && 'text-yellow-500',
                    t.criticality === 'Low' && 'text-blue-500'
                  )}>{t.criticality}</span>
                </p>
                <p>Location: {t.location}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>

      <div className="absolute bottom-4 right-4 bg-background/80 p-3 rounded-lg border shadow-lg">
          <h4 className="font-bold text-sm mb-2">Legend</h4>
          <div className="flex flex-col gap-2 text-xs">
            {Object.entries(healthStatusColors).map(([status, className]) => (
                 <div key={status} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full border", className.split(' ').slice(0, 2).join(' '))}></div>
                    <span>{status}</span>
                 </div>
            ))}
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500"></div>
                <span>AI Risk Zone</span>
            </div>
          </div>
      </div>
    </div>
  )
}
