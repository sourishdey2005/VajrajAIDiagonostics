
"use client"

import { useState, useEffect } from "react"
import { useUserRole } from "@/contexts/user-role-context"
import { useRouter } from "next/navigation"
import {
  Complaint,
} from "@/lib/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PowerOff, SignalLow, Sparkles, Loader2 } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { Skeleton } from "@/components/ui/skeleton"

const issueIcons = {
  power_outage: <PowerOff className="w-4 h-4" />,
  voltage_drop: <SignalLow className="w-4 h-4" />,
  sparking: <Sparkles className="w-4 h-4" />,
}

const statusColors: Record<Complaint['status'], string> = {
    Open: "bg-red-100 text-red-800 border-red-200",
    'In Progress': "bg-yellow-100 text-yellow-800 border-yellow-200",
    Resolved: "bg-green-100 text-green-800 border-green-200"
}

export default function AssignedComplaintsPage() {
  const { role } = useUserRole()
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true)
    if (role !== "field_engineer") {
      router.replace("/dashboard")
    }
  }, [role, router])

  useEffect(() => {
    if (role === "field_engineer") {
        const fetchComplaints = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('complaints')
                .select('*')
                .in('status', ['Open', 'In Progress'])
                .order('timestamp', { ascending: false });

            if (error) {
                toast({ title: "Error", description: "Could not fetch complaints.", variant: "destructive" });
            } else {
                setComplaints(data as unknown as Complaint[]);
            }
            setIsLoading(false);
        };
        fetchComplaints();
    }
  }, [role, toast]);

  const handleStatusChange = async (complaintId: string, newStatus: Complaint['status']) => {
      const originalComplaints = [...complaints];
      
      const updatedComplaints = complaints.map(c => c.id === complaintId ? { ...c, status: newStatus } : c);
      setComplaints(updatedComplaints);

      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', complaintId);

      if (error) {
          setComplaints(originalComplaints);
          toast({ title: "Update Failed", description: "Could not update the complaint status.", variant: "destructive" });
      } else {
          toast({
              title: "Status Updated",
              description: `Complaint #${complaintId.slice(-6)} has been updated to "${newStatus}".`
          });
          // If resolved, remove from the list
          if (newStatus === 'Resolved') {
              setComplaints(prev => prev.filter(c => c.id !== complaintId));
          }
      }
  }

  if (!isClient || role !== "field_engineer") {
    return null
  }
  
  if (isLoading) {
    return (
       <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Open Complaints
                </h1>
                <p className="text-muted-foreground">
                    All active user-reported issues across all operational areas.
                </p>
            </div>
            <Card>
                <CardContent className="p-6 space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <div className="flex items-center justify-center pt-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="ml-4 text-muted-foreground">Fetching assigned complaints...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Open Complaints
        </h1>
        <p className="text-muted-foreground">
          All active user-reported issues across all operational areas.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {issueIcons[complaint.issueType as keyof typeof issueIcons]}
                        <span className="font-medium capitalize">
                          {complaint.issueType.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{complaint.address}</span>
                         <span className="text-xs text-muted-foreground">
                          {complaint.pincode} ({complaint.zone} Zone)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(parseISO(complaint.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {complaint.description}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => handleStatusChange(complaint.id, value as Complaint['status'])}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full font-semibold",
                            statusColors[complaint.status]
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No open complaints at the moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

    