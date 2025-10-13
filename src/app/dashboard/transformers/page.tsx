"use client"

import { useState } from "react"
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
import { PlusCircle } from "lucide-react"
import { AddTransformerDialog } from "./components/add-transformer-dialog"

type Transformer = typeof initialTransformers[0];

export default function TransformersPage() {
  const [transformers, setTransformers] = useState(initialTransformers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddTransformer = (newTransformer: Omit<Transformer, 'id' | 'status'>) => {
    const newId = `TR-${String(transformers.length + 1).padStart(3, '0')}`;
    setTransformers(prev => [...prev, { ...newTransformer, id: newId, status: 'Operational' }]);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transformer Fleet</CardTitle>
            <CardDescription>
              A list of all transformers under your supervision.
            </CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transformer
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transformer ID</TableHead>
                <TableHead>Substation</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criticality</TableHead>
                <TableHead>Load (%)</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Serviced By</TableHead>
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
                      className={cn(transformer.status === "Operational" && "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700")}
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
                      className={cn(transformer.criticality === "Medium" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700")}
                    >
                      {transformer.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell>{transformer.load}%</TableCell>
                  <TableCell>{transformer.manufacturer}</TableCell>
                  <TableCell>{transformer.last_inspection}</TableCell>
                  <TableCell>{transformer.nextServiceDate}</TableCell>
                  <TableCell>{transformer.servicedBy}</TableCell>
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
