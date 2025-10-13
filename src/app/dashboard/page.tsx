import { Activity, AlertTriangle, BadgePercent, CircuitBoard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { dashboardStats } from "@/lib/data"
import { AnalysisTrendChart, CriticalityDistributionChart, FaultDistributionChart, ManufacturerDistributionChart, TransformerStatusChart } from "./components/dashboard-charts"

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">{dashboardStats.health}%</div>
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

      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <FaultDistributionChart className="lg:col-span-3" />
        <TransformerStatusChart className="lg:col-span-2" />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
          <CriticalityDistributionChart className="lg:col-span-2" />
          <AnalysisTrendChart className="lg:col-span-3" />
      </div>
       <div className="grid gap-4 md:gap-8">
        <ManufacturerDistributionChart />
      </div>
    </div>
  )
}
