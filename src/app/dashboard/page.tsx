
"use client"

import { useState, useEffect, useMemo } from "react"
import { useUserRole } from "@/contexts/user-role-context"
import { Activity, AlertTriangle, BadgePercent, CircuitBoard, Siren, Clock, Zap, MapPin, Search, Grid, Wrench, RefreshCw, Loader2, PowerOff, SignalLow, Sparkles, Phone, ShieldHalf, Ambulance, FireExtinguisher } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { transformers as initialTransformers, type Transformer } from "@/lib/data"
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
import { differenceInDays, formatDistanceToNow, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"


// Helper to generate chart colors
const generateChartColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(var(--chart-${(i % 5) + 1}))`);
  }
  return colors;
};

function Countdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const distance = differenceInDays(parseISO(date), new Date());
      if (distance < 0) {
        return `${formatDistanceToNow(parseISO(date))} overdue`;
      }
      return `in ${formatDistanceToNow(parseISO(date))}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(interval);
  }, [date]);

  return <span className="font-semibold">{timeLeft}</span>;
}

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
            const nearbyTransformers = initialTransformers.filter(t => ['TR-001', 'TR-015'].includes(t.id));
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

const faultReasons = [
    { type: "Grid Overload", icon: Grid, color: "text-orange-500", bgColor: "bg-orange-50 border-orange-200 dark:bg-orange-900/50 dark:border-orange-800", message: "High demand is causing stress on the grid. Power may be intermittent." },
    { type: "Transformer Fault", icon: AlertTriangle, color: "text-destructive", bgColor: "bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800", message: "A nearby transformer is experiencing issues. A field crew has been dispatched." },
    { type: "Scheduled Maintenance", icon: Wrench, color: "text-blue-500", bgColor: "bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800", message: "Planned maintenance is underway in your area to improve service." },
    { type: "All Clear", icon: Zap, color: "text-green-500", bgColor: "bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800", message: "Our systems indicate no grid-level issues in your immediate area." }
];

function LiveFaultTrackerCard() {
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleCheckStatus = () => {
        setIsLoading(true);
        setStatus(null);
        setTimeout(() => {
            const randomReason = faultReasons[Math.floor(Math.random() * faultReasons.length)];
            setStatus(randomReason);
            setIsLoading(false);
        }, 1500);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap /> Live Fault Tracker</CardTitle>
                <CardDescription>"Why’s My Power Fluctuating?" Get real-time answers to common consumer confusion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button onClick={handleCheckStatus} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Checking Live Status...' : 'Check My Power Status'}
                </Button>

                {status && (
                    <Alert className={cn("mt-4", status.bgColor)}>
                        <status.icon className={cn("h-4 w-4", status.color)} />
                        <AlertTitle className={cn(status.color, "font-bold")}>
                            Status: {status.type}
                        </AlertTitle>
                        <AlertDescription>
                            {status.message}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

const issueTypes = [
  { value: "power_outage", label: "Power Outage / Blackout", icon: PowerOff },
  { value: "voltage_drop", label: "Voltage Drop / Fluctuation", icon: SignalLow },
  { value: "sparking", label: "Sparking / Potential Hazard", icon: Sparkles },
];


function ReportIssueCard() {
    const { toast } = useToast();
    const [issueType, setIssueType] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueType) {
            toast({
                title: "Please select an issue type.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            toast({
                title: "Report Submitted",
                description: "Thank you for your feedback. Our team has been notified.",
            });
            setIssueType("");
            setDetails("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report a Power Issue</CardTitle>
                <CardDescription>Experiencing problems with your electricity supply? Let us know.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="issue-type">Issue Type</Label>
                        <Select value={issueType} onValueChange={setIssueType}>
                            <SelectTrigger id="issue-type">
                                <SelectValue placeholder="Select an issue type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {issueTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                            <type.icon className="w-4 h-4 text-muted-foreground" />
                                            <span>{type.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issue-details">Additional Details (Optional)</Label>
                        <Textarea 
                            id="issue-details"
                            placeholder="e.g., 'Flickering lights for the last hour in Bandra West...'"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Report
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

const emergencyContacts = [
    { name: "National Emergency Helpline", number: "112", icon: Phone, color: "text-destructive" },
    { name: "Police", number: "100", icon: ShieldHalf, color: "text-blue-600" },
    { name: "Fire", number: "101", icon: FireExtinguisher, color: "text-orange-500" },
    { name: "Ambulance", number: "102 / 108", icon: Ambulance, color: "text-red-600" },
    { name: "Disaster Management", number: "1077", icon: AlertTriangle, color: "text-yellow-600" },
];

function EmergencyContactsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="text-destructive" /> Emergency Contacts</CardTitle>
                <CardDescription>Quick access to all-India emergency helplines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {emergencyContacts.map(contact => (
                    <div key={contact.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <contact.icon className={cn("w-5 h-5", contact.color)} />
                            <span className="font-medium">{contact.name}</span>
                        </div>
                        <a href={`tel:${contact.number}`} className="font-bold text-lg text-primary tracking-wider">{contact.number}</a>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { role, userName, setUserName } = useUserRole();
  const { toast } = useToast()

  const [transformers, setTransformers] = useState<Transformer[]>([]);
  const [profileName, setProfileName] = useState(userName);

  useEffect(() => {
    setProfileName(userName);
  }, [userName]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
        setTransformers(initialTransformers);
        setIsLoading(false);
    }, 1000);
  }, []);


  const dashboardStats = useMemo(() => {
    if (transformers.length === 0) {
        return { monitored: 0, alerts: 0, health: 100 };
    }
    const operational = transformers.filter(t => t.status === 'Operational').length;
    const health = transformers.length > 0 ? Math.round((operational / transformers.length) * 100) : 100;
    const alerts = transformers.filter(t => t.status === 'Needs Attention').length;
    return {
      monitored: transformers.length,
      alerts: alerts,
      health: health
    }
  }, [transformers]);
  
  const [systemHealth, setSystemHealth] = useState(dashboardStats.health);
  
  useEffect(() => {
    setSystemHealth(dashboardStats.health);
    if (dashboardStats.health === 100) return; // Don't fluctuate if perfect
    
    const interval = setInterval(() => {
      setSystemHealth(prevHealth => {
        const fluctuation = (Math.random() - 0.5) * 0.2;
        const newHealth = prevHealth + fluctuation;
        if (newHealth > 100) return 100;
        if (newHealth < dashboardStats.health - 2) return dashboardStats.health -2; // Don't let it dip too low
        return newHealth;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [dashboardStats.health]);


  const criticalTransformers = useMemo(() => {
      return transformers.filter(t => t.status === 'Needs Attention').sort((a,b) => new Date(a.nextServiceDate).getTime() - new Date(b.nextServiceDate).getTime());
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
  
  const handleProfileSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (profileName) {
        setUserName(profileName);
      }
      toast({
          title: "Details Saved",
          description: "Your information has been updated successfully.",
      })
  }


  if (isLoading) {
    return (
       <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Loading Dashboard...
            </h1>
            <p className="text-muted-foreground max-w-[700px]">
              Please wait while we prepare your command center.
            </p>
          </div>
           <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
           </div>
           <Skeleton className="h-96 w-full" />
           <Skeleton className="h-96 w-full" />
       </div>
    );
  }
  
  if (role === 'user') {
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
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        This information helps us tailor our services to your specific needs.
                    </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileSubmit}>
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
                <LiveFaultTrackerCard />
            </div>
            <div className="space-y-8">
                <AreaHealthCard />
                <ReportIssueCard />
                <EmergencyContactsCard />
            </div>
        </div>
      </div>
    )
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
            <div className="text-2xl font-bold">{systemHealth.toFixed(1)}%</div>
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

        {criticalTransformers.length > 0 && (
            <Card className="border-destructive/80 bg-destructive/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><Siren /> Critical Alert Center</CardTitle>
                    <CardDescription className="text-destructive/80">
                        The following transformers require immediate attention.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {criticalTransformers.map(t => (
                        <Card key={t.id} className="bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    <span>{t.id} - {t.name}</span>
                                     <span className={cn("px-2 py-0.5 text-xs rounded-full",
                                        t.criticality === "High" ? "bg-destructive text-destructive-foreground" :
                                        t.criticality === "Medium" ? "bg-yellow-500 text-black" :
                                        "bg-blue-500 text-white"
                                     )}>{t.criticality}</span>
                                </CardTitle>
                                <CardDescription>{t.location}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-destructive font-medium border-t pt-4">
                                   <div className="flex items-center gap-2">
                                     <Clock className="w-4 h-4"/>
                                     <span>Service Due</span>
                                   </div>
                                   <Countdown date={t.nextServiceDate} />
                                </div>
                                <Button asChild size="sm" className="w-full mt-4">
                                  <Link href={`/dashboard/transformers/${t.id}`}>View Details</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )}

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
