"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HealthStatus, Zone, MaintenanceStatus } from "../page"

interface MapControlsProps {
  filters: {
    health: HealthStatus;
    zone: Zone;
    maintenance: MaintenanceStatus;
  };
  onFilterChange: React.Dispatch<React.SetStateAction<MapControlsProps['filters']>>;
}

export function MapControls({ filters, onFilterChange }: MapControlsProps) {
    
    const handleFilter = <K extends keyof MapControlsProps['filters']>(key: K, value: MapControlsProps['filters'][K]) => {
        onFilterChange(prev => ({...prev, [key]: value}))
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map Filters</CardTitle>
        <CardDescription>Refine the assets shown on the map.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="health-status">Health Status</Label>
          <Select value={filters.health} onValueChange={(value: HealthStatus) => handleFilter('health', value)}>
            <SelectTrigger id="health-status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Healthy">Healthy</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="zone">Grid Zone</Label>
          <Select value={filters.zone} onValueChange={(value: Zone) => handleFilter('zone', value)}>
            <SelectTrigger id="zone">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All Zones</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="maintenance-status">Maintenance Status</Label>
          <Select value={filters.maintenance} onValueChange={(value: MaintenanceStatus) => handleFilter('maintenance', value)}>
            <SelectTrigger id="maintenance-status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Due Soon">Due Soon</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
