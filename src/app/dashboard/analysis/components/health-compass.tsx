"use client"

import { cn } from "@/lib/utils"

interface HealthCompassProps {
  angle: number
  faultClassification: string
  className?: string
}

const labels = [
  { name: "Mechanical", angle: 0 },
  { name: "Core", angle: 90 },
  { name: "Winding", angle: 180 },
  { name: "Thermal", angle: 270 },
];

export function HealthCompass({ angle, faultClassification, className }: HealthCompassProps) {
  return (
    <div className={cn("relative w-64 h-64", className)}>
      {/* Outer rings and markings */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-muted/30"></div>
      <div className="absolute inset-[15%] rounded-full border-2 border-dashed border-primary/20"></div>
      <div className="absolute inset-[30%] rounded-full border border-primary/20"></div>
      
      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20"></div>
      <div className="absolute left-1/2 top-0 h-full w-px bg-primary/20"></div>

      {/* Directional Labels */}
      {labels.map(({ name, angle: labelAngle }) => (
        <div
          key={name}
          className="absolute text-xs font-bold text-primary/80"
          style={{
            top: `calc(50% - 0.75rem * ${Math.cos(labelAngle * Math.PI / 180)})`,
            left: `calc(50% + 0.75rem * ${Math.sin(labelAngle * Math.PI / 180)})`,
            transform: `translate(-50%, -50%) translate(${Math.sin(labelAngle * Math.PI / 180) * 110}px, ${-Math.cos(labelAngle * Math.PI / 180) * 110}px)`,
          }}
        >
          {name}
        </div>
      ))}
      
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-background border-2 border-primary/30 flex flex-col items-center justify-center p-2 text-center shadow-lg">
         <p className="text-xs text-muted-foreground">Fault Risk</p>
         <p className="text-sm font-bold leading-tight text-destructive">{faultClassification}</p>
      </div>

      {/* Compass Needle */}
      <div
        className="absolute top-1/2 left-1/2 w-2 h-28 origin-bottom transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
            {/* Needle shape */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-destructive"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-destructive"></div>
      </div>

      {/* Radar sweep animation */}
      <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(50%_50%,transparent_40%,#000_41%)]">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-primary/30 to-transparent animate-spin [animation-duration:3s]"></div>
      </div>
    </div>
  );
}
