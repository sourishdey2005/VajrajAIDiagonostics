"use client"

import { useUserRole } from "@/contexts/user-role-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import React, { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Zap, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { transformers } from "@/lib/data"

const electricitySuppliers = [
    "Adani Electricity Mumbai Ltd",
    "Tata Power",
    "Brihanmumbai Electric Supply and Transport (BEST)",
    "Torrent Power",
    "India Power Corporation Limited",
    "Other"
];

function AreaHealthCard() {
    const [pincode, setPincode] = useState("400050");
    const [areaStatus, setAreaStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckStatus = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            // Simulate fetching data for the PIN code
            const nearbyTransformers = transformers.filter(t => ['TR-001', 'TR-015'].includes(t.id));
            const criticalAlerts = nearbyTransformers.filter(t => t.status === 'Needs Attention').length;
            const upcomingMaintenance = nearbyTransformers.filter(t => new Date(t.nextServiceDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
            
            setAreaStatus({
                pincode,
                overall: criticalAlerts > 0 ? "Potential Issues" : "All Clear",
                criticalAlerts,
                upcomingMaintenance: upcomingMaintenance.length
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin /> Transformer Health in My Area</CardTitle>
                <CardDescription>Enter your PIN code to see the status of nearby transformers and potential outages.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCheckStatus}>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            id="pincode-check" 
                            placeholder="Enter your Pincode" 
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            required 
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Checking...' : <><Search className="w-4 h-4 mr-2" /> Check</>}
                        </Button>
                    </div>

                    {areaStatus && (
                         <Alert variant={areaStatus.overall === "Potential Issues" ? "destructive" : "default"} className={cn(areaStatus.overall === "All Clear" && "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600")}>
                            <Zap className="h-4 w-4" />
                            <AlertTitle>Status for Pincode {areaStatus.pincode}: <span className="font-bold">{areaStatus.overall}</span></AlertTitle>
                            <AlertDescription className="mt-2 space-y-1">
                                <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> <strong>{areaStatus.criticalAlerts}</strong> transformers with active alerts.</p>
                                <p className="flex items-center gap-2"><Clock className="w-4 h-4"/> <strong>{areaStatus.upcomingMaintenance}</strong> transformers with upcoming maintenance in the next 30 days.</p>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </form>
        </Card>
    );
}


export function UserDashboard() {
  const { userName } = useUserRole();
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      toast({
          title: "Details Saved",
          description: "Your information has been updated successfully.",
      })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and check the health of transformers in your area.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
                This information helps us tailor our services to your specific needs.
            </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="consumer-id">Consumer ID</Label>
                <Input id="consumer-id" placeholder="Enter your Consumer ID" required />
                </div>
                <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="supplier">Electricity Supplier</Label>
                <Select>
                    <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select your supplier" />
                    </SelectTrigger>
                    <SelectContent>
                    {electricitySuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="area">Area / Locality</Label>
                <Input id="area" placeholder="e.g., Bandra West" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" placeholder="e.g., 400050" required />
                </div>
                 <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="e.g., Mumbai" required />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Save Details</Button>
            </CardFooter>
            </form>
        </Card>
        <AreaHealthCard />
      </div>
    </div>
  )
}

    