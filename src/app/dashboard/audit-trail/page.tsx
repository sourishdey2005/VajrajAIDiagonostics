
'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, MessageSquare, AlertCircle, Bot, User, HardHat, Shield } from 'lucide-react';
import { auditLogData, type AuditLogEntry } from '@/lib/audit-log-data';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';

const actionColors: Record<string, string> = {
    CREATE: 'bg-blue-100 text-blue-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    ESCALATED: 'bg-orange-100 text-orange-800',
    GENERATE: 'bg-purple-100 text-purple-800',
    ANALYSIS_COMPLETE: 'bg-indigo-100 text-indigo-800',
    ALERT: 'bg-red-100 text-red-800',
}

const iconMap: Record<AuditLogEntry['targetType'], React.ReactNode> = {
    Transformer: <AlertCircle className="w-4 h-4" />,
    Analysis: <Bot className="w-4 h-4" />,
    Report: <FileText className="w-4 h-4" />,
    Note: <MessageSquare className="w-4 h-4" />,
    User: <User className="w-4 h-4" />,
};

const roleIconMap: Record<AuditLogEntry['actorRole'], React.ReactNode> = {
    'Manager': <Shield className="w-4 h-4" />,
    'Field Engineer': <HardHat className="w-4 h-4" />,
    'System': <Bot className="w-4 h-4" />,
}

export default function AuditTrailPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [logs, setLogs] = useState<AuditLogEntry[]>(auditLogData);
    const [filters, setFilters] = useState({
        actor: 'All',
        action: 'All',
        targetType: 'All',
        search: ''
    });

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    const uniqueActors = ['All', ...Array.from(new Set(auditLogData.map(log => log.actorName)))];
    const uniqueActions = ['All', ...Array.from(new Set(auditLogData.map(log => log.action)))];
    const uniqueTargetTypes = ['All', ...Array.from(new Set(auditLogData.map(log => log.targetType)))];

    useEffect(() => {
        let filtered = auditLogData;
        if (filters.actor !== 'All') {
            filtered = filtered.filter(log => log.actorName === filters.actor);
        }
        if (filters.action !== 'All') {
            filtered = filtered.filter(log => log.action === filters.action);
        }
        if (filters.targetType !== 'All') {
            filtered = filtered.filter(log => log.targetType === filters.targetType);
        }
        if(filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(log => 
                log.details.toLowerCase().includes(searchTerm) || 
                log.targetId.toLowerCase().includes(searchTerm)
            );
        }
        setLogs(filtered);
    }, [filters]);


    if (!isClient || role !== 'manager') {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Audit Trail
                </h1>
                <p className="text-muted-foreground">
                    A chronological log of all significant actions taken within the system.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Filter Logs</CardTitle>
                    <div className="grid md:grid-cols-4 gap-4 pt-4">
                        <Input 
                            placeholder="Search details or IDs..." 
                            value={filters.search} 
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                         <Select value={filters.actor} onValueChange={(value) => setFilters(prev => ({...prev, actor: value}))}>
                            <SelectTrigger><SelectValue placeholder="Filter by Actor" /></SelectTrigger>
                            <SelectContent>
                                {uniqueActors.map(actor => <SelectItem key={actor} value={actor}>{actor}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({...prev, action: value}))}>
                            <SelectTrigger><SelectValue placeholder="Filter by Action" /></SelectTrigger>
                            <SelectContent>
                                {uniqueActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filters.targetType} onValueChange={(value) => setFilters(prev => ({...prev, targetType: value}))}>
                            <SelectTrigger><SelectValue placeholder="Filter by Type" /></SelectTrigger>
                            <SelectContent>
                                {uniqueTargetTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{format(parseISO(log.timestamp), 'dd MMM yyyy, HH:mm:ss')}</span>
                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="text-muted-foreground">{roleIconMap[log.actorRole]}</div>
                                            <div>
                                                <p className="font-medium">{log.actorName}</p>
                                                <p className="text-xs text-muted-foreground">{log.actorRole}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("font-semibold", actionColors[log.action])}>
                                            {log.action.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <div className="flex items-center gap-2 font-mono text-xs">
                                            <div className="text-muted-foreground">{iconMap[log.targetType]}</div>
                                            <span>{log.targetId}</span>
                                        </div>
                                     </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
