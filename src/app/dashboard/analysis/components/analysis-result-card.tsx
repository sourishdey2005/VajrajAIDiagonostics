"use client"

import { useEffect, useState, useTransition } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { AlertCircle, Bot, BrainCircuit, Lightbulb, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { augmentDashboardWithAIExplanations } from "@/ai/flows/augment-dashboard-with-ai-explanations"
import { generateActionableInsights } from "@/ai/flows/generate-actionable-insights"
import { suggestExpertSystemRules } from "@/ai/flows/suggest-expert-system-rules"
import { useUserRole } from "@/contexts/user-role-context"
import { ChartTooltipContent } from "@/components/ui/chart"

type AnalysisResult = {
  faultClassification: string;
  confidenceScore: number;
  transformerId: string;
  criticality: string;
  rawFraDataSummary: string;
}

interface AnalysisResultCardProps {
  result: AnalysisResult | null
  isLoading: boolean
}

const AIFetcher = ({ flow, input, icon, title }: { flow: (input: any) => Promise<{ [key: string]: any }>, input: any, icon: React.ReactNode, title: string }) => {
  const [data, setData] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const output = await flow(input)
      const key = Object.keys(output)[0];
      setData(output[key] as string)
    })
  }, [input, flow])

  const renderContent = () => {
    if (isPending) {
      return <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-4" />
        <Skeleton className="h-4 w-full" />
      </div>
    }

    if (!data) return <p>No insights generated.</p>
    
    // Check if data is JSON for the rules
    try {
      const jsonData = JSON.parse(data);
      if (Array.isArray(jsonData)) {
        return (
          <div className="space-y-4 font-code text-sm">
            {jsonData.map((rule, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                <p><span className="font-semibold text-primary">Condition:</span> {rule.condition}</p>
                <p className="mt-2"><span className="font-semibold text-primary">Suggestion:</span> {rule.maintenanceSuggestion}</p>
              </div>
            ))}
          </div>
        )
      }
    } catch (e) {
      // Not JSON, render as text
      return <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{data}</p>
    }

    return <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{data}</p>
  }


  return (
    <div className="flex items-start gap-4 p-1">
      <div className="text-primary pt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="mt-2">{renderContent()}</div>
      </div>
    </div>
  )
}

export function AnalysisResultCard({ result, isLoading }: AnalysisResultCardProps) {
  const { role } = useUserRole();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Running AI Analysis...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process the FRA data.</p>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!result) return null

  const confidenceData = [{ name: 'Confidence', value: result.confidenceScore * 100 }]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight font-headline">Analysis Complete</CardTitle>
            <CardDescription>
              AI-powered fault diagnosis for <span className="font-semibold text-primary">{result.transformerId}</span>
            </CardDescription>
          </div>
          <Badge variant={result.criticality === "High" ? "destructive" : result.criticality === "Medium" ? "default" : "secondary"}>
              {result.criticality} Criticality
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="ai-explanation">AI Explanation</TabsTrigger>
            <TabsTrigger value="actions">Maintenance Actions</TabsTrigger>
            {role === 'manager' && <TabsTrigger value="expert-system">Expert System Rules</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5" /> Detected Fault</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-destructive">{result.faultClassification}</p>
                  <p className="text-sm text-destructive/80">Based on the provided FRA signature.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Confidence Score</CardTitle>
                   <CardDescription>Probability of the detected fault being correct.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[60px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={confidenceData} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent hideLabel hideIndicator />} />
                        <Bar dataKey="value" fill="var(--color-chart-1)" radius={4} barSize={20}>
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                   <p className="text-right text-2xl font-bold mt-2">{(result.confidenceScore * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Raw Data Summary</h3>
              <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border font-mono">{result.rawFraDataSummary}</p>
            </div>
          </TabsContent>

          <TabsContent value="ai-explanation">
            <AIFetcher flow={augmentDashboardWithAIExplanations} input={result} icon={<Bot className="w-6 h-6" />} title="AI-Generated Explanation" />
          </TabsContent>

          <TabsContent value="actions">
            <AIFetcher flow={generateActionableInsights} input={result} icon={<Lightbulb className="w-6 h-6" />} title="Recommended Actions" />
          </TabsContent>
          
          {role === 'manager' && (
            <TabsContent value="expert-system">
              <AIFetcher flow={suggestExpertSystemRules} input={result} icon={<BrainCircuit className="w-6 h-6" />} title="Suggested Expert System Rules" />
            </TabsContent>
          )}

        </Tabs>
      </CardContent>
    </Card>
  )
}
