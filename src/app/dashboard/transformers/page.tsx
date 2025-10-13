"use client"

import { useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
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
import { transformers as initialTransformers } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal, Eye } from "lucide-react"
import { AddTransformerDialog } from "./components/add-transformer-dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

type Transformer = typeof initialTransformers[0];

export default function TransformersPage() {
  const [transformers, setTransformers] = useState(initialTransformers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

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
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">Transformer Fleet</h1>
          <p className="text-muted-foreground max-w-[700px]">
            A comprehensive list of all transformers under your supervision.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transformer
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Substation</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead className="text-right">Load (%)</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Serviced By</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformers.map((transformer) => (
                <TableRow key={transformer.id}>
                  <TableCell className="font-medium">{transformer.id}</TableCell>
                  <TableCell>{transformer.name}</TableCell>
                  <TableCell>{transformer.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transformer.status === "Operational"
                          ? "secondary"
                          : transformer.status === "Needs Attention"
                          ? "destructive"
                          : "outline"
                      }
                      className={cn(
                        "font-semibold",
                        transformer.status === "Operational" && "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
                        transformer.status === "Needs Attention" && "bg-destructive/10 text-destructive border-destructive/20",
                        transformer.status === "Under Maintenance" && "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        )}
                    >
                      {transformer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transformer.criticality === "High"
                          ? "destructive"
                          : transformer.criticality === "Medium"
                          ? "default"
                          : "secondary"
                      }
                       className={cn(
                        transformer.criticality === "High" && "bg-destructive/10 text-destructive border-destructive/20",
                        transformer.criticality === "Medium" && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
                        transformer.criticality === "Low" && "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                      )}
                    >
                      {transformer.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{transformer.load}%</TableCell>
                  <TableCell>{transformer.manufacturer}</TableCell>
                  <TableCell>{format(parseISO(transformer.last_inspection), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{format(parseISO(transformer.nextServiceDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{transformer.servicedBy}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/transformers/${transformer.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddTransformerDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTransformer={handleAddTransformer}
      />
    </>
  )
}
