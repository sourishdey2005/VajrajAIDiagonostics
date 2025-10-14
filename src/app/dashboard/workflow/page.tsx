
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUserRole } from '@/contexts/user-role-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { transformers as initialTransformers, Transformer, recentlyResolved } from '@/lib/data';
import { MoreHorizontal, AlertTriangle, Construction, CheckCircle2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { AddTransformerDialog } from '../transformers/components/add-transformer-dialog';
import { useToast } from '@/hooks/use-toast';


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

function TransformerTaskCard({ task }: { task: Task }) {
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
                            <DropdownMenuItem>Assign Engineer</DropdownMenuItem>
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

function ResolvedTaskCard({ task }: { task: (typeof recentlyResolved)[0] }) {
    return (
        <Card className="mb-4 bg-background/80 hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base">{task.transformerId}</CardTitle>
                        <CardDescription>Fault: {task.faultType}</CardDescription>
                    </div>
                </div>
            </CardHeader>
             <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                <p>Resolved by {task.resolvedBy} {formatDistanceToNow(parseISO(task.resolvedDate), { addSuffix: true })}</p>
            </CardContent>
        </Card>
    )
}

function WorkflowColumn({ columnId, tasks, resolvedTasks }: { columnId: ColumnId, tasks: Task[], resolvedTasks: (typeof recentlyResolved) }) {
    const { title, icon, description, color } = columnStyles[columnId];
    
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
                {columnId === 'new' && tasks.filter(t => t.status === 'Needs Attention').map(task => <TransformerTaskCard key={task.id} task={task} />)}
                {columnId === 'progress' && tasks.filter(t => t.status === 'Under Maintenance').map(task => <TransformerTaskCard key={task.id} task={task} />)}
                {columnId === 'resolved' && resolvedTasks.map(task => <ResolvedTaskCard key={task.id} task={task} />)}
                
                {columnId === 'new' && tasks.filter(t => t.status === 'Needs Attention').length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No new issues.</p>}
                {columnId === 'progress' && tasks.filter(t => t.status === 'Under Maintenance').length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks in progress.</p>}
                {columnId === 'resolved' && resolvedTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No recently resolved issues.</p>}
            </CardContent>
        </Card>
    );
}

export default function WorkflowPage() {
    const { role } = useUserRole();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [transformers, setTransformers] = useState<Transformer[]>(initialTransformers);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        if (role !== 'manager') {
            router.replace('/dashboard');
        }
        try {
            const storedTransformers = localStorage.getItem("transformers");
            if (storedTransformers) {
                setTransformers(JSON.parse(storedTransformers));
            }
        } catch (error) {
            console.error("Could not load transformers from localStorage", error);
        }

    }, [role, router]);

    useEffect(() => {
        if (isClient) {
            try {
                localStorage.setItem("transformers", JSON.stringify(transformers));
            } catch (error) {
                console.error("Could not save transformers to localStorage", error);
            }
        }
    }, [transformers, isClient]);

    const handleAddTransformer = (data: Omit<Transformer, 'id' | 'status'> & { last_inspection: Date, nextServiceDate: Date }) => {
        const newId = `TR-${String(transformers.length + 1).padStart(3, '0')}`;
        const newTransformer: Transformer = {
          ...data,
          id: newId,
          status: 'Operational',
          last_inspection: format(data.last_inspection, 'yyyy-MM-dd'),
          nextServiceDate: format(data.nextServiceDate, 'yyyy-MM-dd'),
        }
        setTransformers(prev => [newTransformer, ...prev]);
        toast({ title: "Transformer Added", description: `${newTransformer.name} has been added to the fleet.` });
    }

    if (!isClient || role !== 'manager') {
        return null;
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
                    <WorkflowColumn columnId="new" tasks={transformers} resolvedTasks={[]} />
                    <WorkflowColumn columnId="progress" tasks={transformers} resolvedTasks={[]} />
                    <WorkflowColumn columnId="resolved" tasks={[]} resolvedTasks={recentlyResolved} />
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
