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
import { transformers } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function TransformersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transformer Fleet</CardTitle>
        <CardDescription>
          A list of all transformers under your supervision.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transformer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>Last Inspection</TableHead>
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
                <TableCell>{transformer.last_inspection}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
