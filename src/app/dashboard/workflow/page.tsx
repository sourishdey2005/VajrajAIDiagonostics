
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transformer, transformers as allTransformers, recentlyResolved, complaintsData } from '@/lib/data';
import { MoreHorizontal, AlertTriangle, Construction, CheckCircle2, PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { AddTransformerDialog } from '../transformers/components/add-transformer-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type RecentlyResolved = {
    id: number;
    transformer_id: string;
    fault_type: string;
    resolved_by: string;
    resolved_date: string;
}

type ColumnId = 'new' | 'progress' | 'resolved';

interface Task extends Transformer {
    id: string;
}

const columnStyles: Record<ColumnId, { title: string; icon: React.ReactNode, description: string, color: string }> = {
    new: {
        title: 'New Issues',
        icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
        description: 'Assets flagged for immediate attention.',
        color: 'border-destructive/50'
    },
    progress: {
        title: 'In Progress',
        icon: <Construction className="w-5 h-5 text-yellow-500" />,
        description: 'Maintenance or inspection currently underway.',
        color: 'border-yellow-500/50'
    },
    resolved: {
        title: 'Recently Resolved',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        description: 'Issues resolved in the last 30 days.',
        color: 'border-green-500/50'
    },
};

function TransformerTaskCard({ task, onStatusChange }: { task: Task, onStatusChange: (id: string, status: Transformer['status']) => void }) {
    return (
        <Card className="mb-4 bg-background/80 hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base">{task.name}</CardTitle>
                        <CardDescription>{task.id}</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/transformers/${task.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'Needs Attention')}>Move to New Issues</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'Under Maintenance')}>Move to In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'Operational')}>Mark as Resolved</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant={
                        task.criticality === 'High' ? 'destructive' :
                        task.criticality === 'Medium' ? 'default' : 'secondary'
                    }>{task.criticality}</Badge>
                    <span>{task.location}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function ResolvedTaskCard({ task }: { task: RecentlyResolved }) {
    return (
        <Card className="mb-4 bg-background/80 hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base">{task.transformer_id}</CardTitle>
                        <CardDescription>Fault: {task.fault_type}</CardDescription>
                    </div>
                </div>
            </CardHeader>
             <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                <p>Resolved by {task.resolved_by} {formatDistanceToNow(parseISO(task.resolved_date), { addSuffix: true })}</p>
            </CardContent>
        </Card>
    )
}

function WorkflowColumn({ columnId, tasks, onStatusChange }: { columnId: ColumnId, tasks: Task[], onStatusChange: (id: string, status: Transformer['status']) => void }) {
    const { title, icon, description, color } = columnStyles[columnId];
    
    let columnContent;
    switch(columnId) {
        case 'new':
            const newTasks = tasks.filter(t => t.status === 'Needs Attention');
            columnContent = newTasks.length > 0 
                ? newTasks.map(task => <TransformerTaskCard key={task.id} task={task} onStatusChange={onStatusChange} />)
                : <p className="text-sm text-muted-foreground text-center py-4">No new issues.</p>;
            break;
        case 'progress':
            const progressTasks = tasks.filter(t => t.status === 'Under Maintenance');
            columnContent = progressTasks.length > 0
                ? progressTasks.map(task => <TransformerTaskCard key={task.id} task={task} onStatusChange={onStatusChange} />)
                : <p className="text-sm text-muted-foreground text-center py-4">No tasks in progress.</p>;
            break;
        case 'resolved':
            columnContent = recentlyResolved.length > 0
                ? recentlyResolved.map(task => <ResolvedTaskCard key={task.id} task={task} />)
                : <p className="text-sm text-muted-foreground text-center py-4">No recently resolved issues.</p>;
            break;
    }

    return (
        <Card className={cn("flex flex-col", color)}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto bg-muted/30 rounded-b-lg p-4">
                {columnContent}
            </CardContent>
        </Card>
    );
}

export default function WorkflowPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [transformers, setTransformers] = useState<Transformer[]>([]);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
    }, [role, router]);

    useEffect(() => {
        if (role === 'manager') {
            setIsLoading(true);
            setTimeout(() => {
                setTransformers(allTransformers);
                setIsLoading(false);
            }, 500);
        }
    }, [role]);

    const handleStatusChange = (id: string, status: Transformer['status']) => {
        setTransformers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        toast({ title: "Status Updated", description: `Moved ${id} to ${status === 'Operational' ? 'Resolved' : status}.` });
    }
    
    const handleAddTransformer = (data: Omit<Transformer, 'id' | 'status'>) => {
        const newTransformer: Transformer = {
          ...data,
          id: `TR-${String(transformers.length + 1).padStart(3, '0')}`,
          status: 'Operational',
        };
        setTransformers(prev => [newTransformer, ...prev]);
        toast({ title: "Transformer Added", description: `${data.name} successfully added.` });
    }


    if (!isClient || role !== 'manager') {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 h-[calc(100vh-10rem)]">
                 <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">Maintenance Workflow</h1>
                        <p className="text-muted-foreground">Visualize and manage the lifecycle of maintenance tasks.</p>
                    </div>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transformer</Button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-4 font-semibold text-muted-foreground">Loading Workflow...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-8 h-[calc(100vh-10rem)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
                            Maintenance Workflow
                        </h1>
                        <p className="text-muted-foreground">
                            Visualize and manage the lifecycle of maintenance tasks.
                        </p>
                    </div>
                    <Button onClick={() => setAddDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Transformer
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    <WorkflowColumn columnId="new" tasks={transformers} onStatusChange={handleStatusChange} />
                    <WorkflowColumn columnId="progress" tasks={transformers} onStatusChange={handleStatusChange}/>
                    <WorkflowColumn columnId="resolved" tasks={transformers} onStatusChange={handleStatusChange}/>
                </div>
            </div>
            <AddTransformerDialog 
                isOpen={isAddDialogOpen}
                onOpenChange={setAddDialogOpen}
                onAddTransformer={handleAddTransformer}
            />
        </>
    );
}
