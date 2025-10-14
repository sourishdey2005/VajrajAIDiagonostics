
"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Send, PowerOff, SignalLow, Sparkles, BrainCircuit, CheckCircle, History } from "lucide-react"
import { Complaint, complaintsData } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

const complaintSchema = z.object({
  issueType: z.string().min(1, "Please select an issue type."),
  description: z.string().min(10, "Please provide at least 10 characters.").max(500, "Description is too long."),
  address: z.string().min(5, "Please enter a valid address."),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode."),
})

type ComplaintFormValues = z.infer<typeof complaintSchema>

const issueTypes = [
  { value: "power_outage", label: "Power Outage / Blackout", icon: PowerOff },
  { value: "voltage_drop", label: "Voltage Drop / Fluctuation", icon: SignalLow },
  { value: "sparking", label: "Sparking / Potential Hazard", icon: Sparkles },
]

const statusColors: Record<Complaint['status'], string> = {
    Open: "text-red-600 bg-red-100",
    'In Progress': "text-yellow-600 bg-yellow-100",
    Resolved: "text-green-600 bg-green-100"
}

export default function ComplaintsPage() {
  const { toast } = useToast()
  const [isAnalyzing, startAnalyzing] = useTransition()
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Simulate fetching user's complaints. In a real app, this would be an API call.
    setMyComplaints(complaintsData.slice(0, 2).map(c => ({...c, status: 'Open'}))); // Initialize with some open complaints for demo
  }, []);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      issueType: "",
      description: "",
      address: "123, Linking Road, Bandra West",
      pincode: "400050",
    },
  })

  function onSubmit(data: ComplaintFormValues) {
    setAnalysisResult(null)
    setIsSubmitted(false)
    startAnalyzing(() => {
      setTimeout(() => {
        if (data.issueType === 'power_outage' || data.issueType === 'sparking') {
          setAnalysisResult("AI has identified 1 nearby transformer with active alerts. This information will be attached to your complaint for faster resolution.")
        } else {
          setAnalysisResult("AI has analyzed local grid data. No immediate critical faults detected, but your report will be used to monitor the situation. This information will be attached to your complaint.")
        }
        
        setTimeout(() => {
            const newComplaint: Complaint = {
                id: `COMP-${Date.now().toString().slice(-6)}`,
                issueType: data.issueType as Complaint['issueType'],
                description: data.description,
                address: data.address,
                pincode: data.pincode,
                zone: 'West', // Mock zone
                timestamp: new Date().toISOString(),
                status: 'Open'
            };
            setMyComplaints(prev => [newComplaint, ...prev]);
            setIsSubmitted(true);
            toast({
              title: "Complaint Submitted Successfully",
              description: `Your complaint #${newComplaint.id} has been filed.`,
              className: "bg-green-100 border-green-200 text-green-800"
            });
            form.reset({
                issueType: "",
                description: "",
                address: "123, Linking Road, Bandra West",
                pincode: "400050",
            });
            setAnalysisResult(null);
        }, 1500)

      }, 2000)
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Report & Track Power Complaints
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Report a power issue and track the status of your complaints in real-time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>File a New Complaint</CardTitle>
                <CardDescription>
                Please provide as much information as possible.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type</Label>
                    <Controller
                    control={form.control}
                    name="issueType"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="issueType">
                            <SelectValue placeholder="Select an issue..." />
                        </SelectTrigger>
                        <SelectContent>
                            {issueTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                    <type.icon className="w-4 h-4 text-muted-foreground" />
                                    <span>{type.label}</span>
                                </div>
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    )}
                    />
                    {form.formState.errors.issueType && <p className="text-sm text-destructive">{form.formState.errors.issueType.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description of Issue</Label>
                    <Textarea id="description" placeholder="e.g., The lights have been flickering for the past hour..." {...form.register("description")} />
                    {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input id="address" {...form.register("address")} />
                        {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" {...form.register("pincode")} />
                        {form.formState.errors.pincode && <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>}
                    </div>
                </div>

                {isAnalyzing && (
                <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI Assistant is Analyzing...
                    </AlertTitle>
                    <AlertDescription>
                    Our AI is checking local transformer health and known grid issues to add context to your complaint.
                    </AlertDescription>
                </Alert>
                )}

                {analysisResult && !isSubmitted && (
                    <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-300 [&>svg]:text-blue-600">
                        <BrainCircuit className="h-4 w-4" />
                        <AlertTitle>AI Analysis Complete</AlertTitle>
                        <AlertDescription>
                        {analysisResult}
                        </AlertDescription>
                </Alert>
                )}
                
                {isSubmitted && (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Complaint Filed</AlertTitle>
                        <AlertDescription>
                        Your complaint has been successfully submitted. You can see its status on the right.
                        </AlertDescription>
                </Alert>
                )}

            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAnalyzing ? (analysisResult ? 'Finalizing...' : 'Submitting & Analyzing') : 'Submit Complaint'}
                </Button>
            </CardFooter>
            </form>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> My Complaints</CardTitle>
                <CardDescription>Track the status of your submitted complaints.</CardDescription>
            </CardHeader>
            <CardContent>
                {myComplaints.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Complaint ID</TableHead>
                                <TableHead>Issue</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myComplaints.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                                    <TableCell className="font-medium capitalize">{c.issueType.replace('_', ' ')}</TableCell>
                                    <TableCell>{format(parseISO(c.timestamp), 'dd MMM, yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("font-semibold", statusColors[c.status])}>{c.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-sm text-muted-foreground py-10">
                        You have not submitted any complaints yet.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
